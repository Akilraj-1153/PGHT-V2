import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../Config/Config';
import { imagedb } from '../../Config/Config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { Imagestate, UserDetails } from '../../HandleData/atoms';

function ProfileEdit() {
    const [userDetails, setUserDetails] = useRecoilState(UserDetails);
    const [editedDetails, setEditedDetails] = useState({
        Name: '',
        Email: '',
    });
    const navigate = useNavigate();
    const [defaultUserImage, setDefaultUserImage] = useRecoilState(Imagestate);
    const allInputs = { imgUrl: '' };
    const [imageAsFile, setImageAsFile] = useState('');
    const [imageAsUrl, setImageAsUrl] = useState(allInputs);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userEmail = JSON.parse(localStorage.getItem('user')).email;
                const userDocRef = doc(db, 'UserDetails', userEmail);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserDetails(userData);
                    setEditedDetails(userData);

                    const imageRef = ref(imagedb, `/images/${userEmail}/${userEmail}`);
                    try {
                        const url = await getDownloadURL(imageRef);
                        setDefaultUserImage(url);
                    } catch (error) {
                        toast.error('Error fetching user image URL!', { autoClose: 2000 });
                    }
                } else {
                    toast.error('User details not found!', { autoClose: 2000 });
                }
            } catch (error) {
                toast.error('Error fetching user details!', { autoClose: 2000 });
            }
        };

        fetchUserDetails();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDetails({
            ...editedDetails,
            [name]: value
        });
    };

    const handleUserImage = (e) => {
        const image = e.target.files[0];
        if (image) {
            setImageAsFile(image);
            setDefaultUserImage(URL.createObjectURL(image)); // Update default user image preview
        } else {
            // Handle the case where no file is selected
            setImageAsFile('');
            setDefaultUserImage(''); // or set to a default image or clear the preview
        }
    };

    const handleProfileSave = async () => {
        const userEmail = JSON.parse(localStorage.getItem('user')).email;

        if (imageAsFile) {
            const storageRef = ref(imagedb, `/images/${userEmail}/${userEmail}`);
            const uploadTask = uploadBytesResumable(storageRef, imageAsFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Progress monitoring
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    toast.error('Error uploading image!', { autoClose: 2000 });
                },
                () => {
                    // Upload complete, get download URL and update state
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageAsUrl(downloadURL); // Assuming you want to display the uploaded image immediately
                        toast.success('Image Uploaded!', { autoClose: 2000 });
                    });
                }
            );
        }

        // Update user details in Firestore
        const docRef = doc(db, 'UserDetails', userEmail);
        const data = {
            Name: editedDetails.Name,
            Email: editedDetails.Email,
        };
        try {
            await setDoc(docRef, data);
            toast.success('User details updated successfully!', { autoClose: 2000 });
        } catch (error) {
            toast.error('Error updating user details:', { autoClose: 2000 });
        }
    };

    return (
        <div className="h-full w-full justify-center items-center flex text-black">
            <div className="h-[85%] w-[90%] md:w-[70%] lg:h-[60%] lg:w-[50%] bg-white rounded-xl ">
                <div className="flex justify-between items-center p-4 h-[7%] w-full shadow-xl">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={handleProfileSave}>Save</button>
                </div>
                <hr />
                <div className="h-[93%] w-full flex flex-col lg:flex-row">
                    <div className="xs:h-1/2 xs:w-full lg:h-full lg:w-1/2 flex flex-col justify-center items-center">
                        <div className='h-[30vh] w-[30vh] rounded-full border-4 border-white/40 flex flex-col overflow-hidden '>
                            <img src={defaultUserImage} alt='user-avatar' />
                        </div>
                    </div>
                    <div className="xs:h-1/2 xs:w-full flex justify-center flex-col items-center lg:h-full lg:w-1/2 p-2">
                        <div className="w-full h-fit flex justify-cente items-center gap-2">
                            <h1 className="font-bold w-fit">Name:</h1>
                            <input
                                className='bg-transparent rounded-sm p-2 outline-none w-fit'
                                name='Name'
                                value={editedDetails?.Name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full h-fit flex justify-cente items-center gap-2">
                            <h1 className="font-bold w-fit">Email:</h1>
                            <input
                                readOnly
                                className='bg-transparent rounded-sm p-2 outline-none w-fit'
                                name='Email'
                                value={editedDetails?.Email}
                            />
                        </div>
                        <div className="w-full h-fit flex justify-cente items-cente gap-2 flex-col sm:flex-row md:flex-col">
                            <label className="font-bold w-fit" htmlFor="file_input">
                                Upload file:
                            </label>
                            <div className="relative">
                                <input
                                    className="hidden"
                                    aria-describedby="file_input_help"
                                    id="file_input"
                                    type="file"
                                    onChange={handleUserImage}
                                />
                                <label
                                    className="block w-[33vh] p-1 flex justify-center items-center text-sm text-gray-900  rounded-md cursor-pointer bg-blue-400 focus:outline-none"
                                    htmlFor="file_input"
                                >
                                    Select a file
                                </label>
                            </div>
                            <p className="mt-1 text-sm text-gray-800 " id="file_input_help">
                                SVG, PNG, JPG or GIF (MAX. 800x400px).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ProfileEdit;
