import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { auth ,provider} from '../../Config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { ref,uploadBytesResumable } from 'firebase/storage';
import { db } from '../../Config/Config';
import { imagedb } from '../../Config/Config';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp({ Logoimg }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [UserData,setUserData]=useState('')
  const navigation = useNavigate();
  const [profileimg, setProfileimg] = useState('');
  const [isvisible,setisVisible]=useState('password')
  const [isCPvisible,setisCPVisible]=useState('password')



  useEffect(() => {
    // Your image data and name assignment logic here
    const imageData = "data:image/png;base64,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"
; // Update with your actual image data
    const imagename = 'userImage.png';

    function dataURLtoFile(imageData, imagename) {
        var arr = imageData.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], imagename, { type: mime });
    }

    setProfileimg(dataURLtoFile(imageData, imagename)); 
}, []);

  const handleLoginNav = () => {
    navigation("/login");
  }

  const onSubmit = async (data) => {
    const { fullName, email, password, confirm_password } = data;

    if (password !== confirm_password) {
      console.error("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDetailsCollection = collection(db, "UserDetails");
      const userDocRef = doc(userDetailsCollection, email);
      await setDoc(userDocRef, {
          Name: fullName,
          Email: email,
          
      });

      // Upload image if available
      if (profileimg) {
          const storageRef = ref(imagedb, `/images/${email}/${email}`);
          const uploadTask = uploadBytesResumable(storageRef, profileimg);

          uploadTask.on(
              'state_changed',
              (snapshot) => {
                  // Progress monitoring
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(`Upload is ${progress}% done`);
              },
              (error) => {
                  console.error('Error uploading image:', error);
              },
              () => {
                  // Upload complete
                  console.log('Image uploaded successfully');
              }
          );
      }
      toast.success('Signup Sucessful', { autoClose: 2000 });
      navigation("/login");

      
    } catch (error) {
      console.error("Error signing up:", error.message);
      toast.error('Failed to Signup,Try Again.', { autoClose: 2000 });

    }
  };

  const signupWithGoogle=()=>{
    signInWithPopup(auth,provider)
    .then((data)=>{
      setUserData(data.user.email)
      navigation('/login')
    })

  }


  function handlepasswordvisible(){
    setisVisible(isvisible == 'password'? 'text':'password')
  }

  function handleConfirmpasswordvisible(){
    setisCPVisible(isCPvisible == 'password'? 'text':'password')
  }


  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='xs:h-[90%] xs:w-[90%]  sm:w-[50%] md:h-[70%] md:w-[40%] lg:h-[70%] lg:w-[25%] flex flex-col md:flex-row'>
        <div className='h-full w-full flex flex-col justify-center items-center gap-2 grow'>
          <form onSubmit={handleSubmit(onSubmit)} className='w-full h-fit gap-2 flex flex-col '>
            <div className='w-full h-[12vh] flex flex-col '>
              <label htmlFor='fullname'>Full Name </label>
              <input id='fullname' {...register('fullName', { required: true })} className='h-[6vh] rounded-lg outline-none text-black p-2' type='text'></input>
              {errors.fullName && <p className='p-2 text-red-900'>Full Name is required.</p>}
            </div>
            <div className='w-full h-[12vh] flex flex-col '>
              <label htmlFor='email'>Email </label>
              <input id='email' {...register('email', { required: true })} className='h-[6vh] rounded-lg outline-none text-black p-2' type='email'></input>
              {errors.email && <p className='p-2 text-red-900'>Email is required.</p>}
            </div>
            <div className='w-full h-[12vh] flex flex-col '>
              <label htmlFor='password'>Password </label>
              <div className='flex gap-5 w-full bg-white rounded-lg justify-center items-center flex'>
              <input id='password' {...register('password', { required: true })} className='h-[6vh] w-[90%] rounded-lg outline-none text-black p-2' type={isvisible}></input>

              <button onClick={handlepasswordvisible} className='mr-5'>{isvisible == 'password'? <FaEyeSlash color='black' size={25}></FaEyeSlash> :<IoEyeSharp color='black' size={25}></IoEyeSharp>} </button>

              </div>
              {errors.password && <p className='p-2 text-red-900'>Password is required.</p>}
            </div>

            <div className='w-full h-[12vh] flex flex-col '>
              <label htmlFor='confirm_password'>Confirm Password </label>
              <div className='flex gap-5 w-full bg-white rounded-lg justify-center items-center flex'>
              <input id='confirm_password' {...register('confirm_password', { required: true })} className='h-[6vh] w-[90%] rounded-lg outline-none text-black p-2' type={isCPvisible}></input>

              <button onClick={handleConfirmpasswordvisible} className='mr-5'>{isCPvisible == 'password'? <FaEyeSlash color='black' size={25}></FaEyeSlash> :<IoEyeSharp color='black' size={25}></IoEyeSharp>} </button>

              </div>
              {errors.confirm_password && <p className='p-2 text-red-900'>Confirm Password is required.</p>}

            </div>

            <div className='w-full h-[12vh] flex flex-col justify-center items-center'>
              <button className='h-[6vh] w-[50%] bg-blue-600 rounded-2xl' type='submit'>Signup</button>
            </div>
          </form>
          <hr />
          <h1>Or SignUp With</h1>
          <div className='cursor-pointer' onClick={signupWithGoogle}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
          </svg>
          </div>
          <div className='h-fit w-full flex flex-row justify-center items-center '>
            <img className='Introicon h-[7vh] w-auto select-none' src={Logoimg} alt="Logo"></img>
            <h1 className='text-lg'>Already have an account? <span onClick={handleLoginNav} className=' text-blue-600 underline cursor-pointer'>Login</span></h1>
          </div>
        </div>
      </div>
      <ToastContainer ></ToastContainer>
    </div>
  );
}

export default SignUp;
