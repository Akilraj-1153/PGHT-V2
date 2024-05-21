import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db, imagedb } from '../../Config/Config';
import { LoginState, UserDetails, Imagestate, DisplayGoogleAlert, ProviderIds } from '../../HandleData/atoms';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { userData } from '../../HandleData/atoms';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Profile() {
  const [displayAlert, setDisplayAlert] = useRecoilState(DisplayGoogleAlert);
  const [provider, setProvider] = useRecoilState(ProviderIds);
  const [userDetails, setUserDetails] = useRecoilState(UserDetails);
  const [defaultUserImage, setDefaultUserImage] = useRecoilState(Imagestate);
  const [pghtuser, setPghtuser] = useRecoilState(userData);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const useDetails = JSON.parse(user);
    setPghtuser(useDetails);
  }, []);

  useEffect(() => {
    if (pghtuser && pghtuser.providerData && pghtuser.providerData[0]) {
      let providerId = pghtuser.providerData[0].providerId;
      setProvider(providerId);
    }
  }, [pghtuser, setProvider]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (provider === 'google.com') {
          setDefaultUserImage(pghtuser.photoURL);
          setName(pghtuser.displayName);
          setEmail(pghtuser.email);
          return;
        }
        const userEmail = JSON.parse(localStorage.getItem('user')).email;
        const userDocRef = doc(db, 'UserDetails', userEmail);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserDetails(userData);
          setEmail(userData.Email);
          setName(userData.Name);

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
  }, [provider, pghtuser, setDefaultUserImage, setUserDetails]);


  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('Logged out Sucessfully!', { autoClose: 2000 });

    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (provider === 'google.com') {
      setDisplayAlert(true);
    }
    else if (provider === 'password'){
      navigate('/mainapp/editprofile')
    }
  };

  const handleClose = () => {
    setDisplayAlert(false);
  };

  return (
    <div className="h-full w-full justify-center items-center  flex text-black">
      <div className="h-[75%] w-[90%] md:w-[70%] lg:h-[60%] lg:w-[50%] bg-white rounded-xl">
        <div className="flex justify-between items-center p-4 h-[7%] w-full shadow-xl">
          <button onClick={handleBack}>Back</button>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <hr></hr>
        <div className="h-[93%] w-full flex flex-col lg:flex-row">
          <div className="xs:h-2/3 xs:w-full  lg:h-full lg:w-1/2 flex justify-center items-center">
          <div className='h-[30vh] w-[30vh]  rounded-full border-4 border-white/40 flex flex-col overflow-hidden'>
                            <img className='rounded-full' src={defaultUserImage} alt='user-avatar' />
                        </div>
          </div>
          <div className="xs:h-1/3 xs:w-full flex justify-center flex-col items-center gap-2 lg:h-full lg:w-1/2 p-2">
            <div className="w-full h-fit flex justify-center  items-center gap-2">
              <h1 className="font-bold">Name :</h1>
              <h1 className="">{Name}</h1>
            </div>
            <div className="w-full h-fit flex justify-center items-center gap-2 ">
              <h1 className="font-bold">Email :</h1>
              <h1 className="">{Email}</h1>
            </div>
          </div>
        </div>
      </div>
      {displayAlert && (
        <div className="absolute gap-10 h-[75%] w-[95%] md:w-[70%] lg:h-[60%] lg:w-[50%] rounded-xl backdrop-blur-3xl  flex justify-center items-center flex-col text-center">
          <h1 className="font-bold">You can't Edit the Profile, Because You are using Your Google Account</h1>
          <div className="text-xl font-bold  border-2 border-black p-2 rounded-md w-fit  hover:bg-black hover:text-white">
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Profile;
