import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth ,provider} from '../../Config/Config';
import { signInWithPopup } from 'firebase/auth';
import { userData } from '../../HandleData/atoms';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../HandleData/atoms';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogIn({ Logoimg }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const[pghtuser,setPghtuser]=useRecoilState(userData)
  const [isvisible,setisVisible]=useState('password')
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);



  
  const navigation = useNavigate();

  const handleSignupNav = () => {
    navigation('/signup');
  };

  function onsubmit(data) {
    const {email,password}=data
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential)
      const user = userCredential.user;
      console.log(user)
      console.log(user.accessToken)
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true)
      navigation('/mainapp/homepage');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error
    });
  }

  const LoginwithGoogle=()=>{
    signInWithPopup(auth,provider)
    .then((userCredential) => {
      
      const user = userCredential.user;
      setPghtuser(user)
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true)
      toast.success('Login Sucessful', { autoClose: 2000 });
      navigation('/mainapp/homepage');

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error('Failed to Login,,Try Again .', { autoClose: 2000 });

    });
  }

  function handlepasswordvisible(){
    setisVisible(isvisible == 'password'? 'text':'password')
  }

  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='xs:h-[90%] xs:w-[90%]  sm:w-[50%] md:h-[70%] md:w-[40%] lg:h-[70%] lg:w-[25%] flex flex-col md:flex-row'>
        <div className='h-full w-full flex flex-col justify-center items-center gap-2 grow'>
          <form onSubmit={handleSubmit(onsubmit)} className='w-full h-fit gap-2 flex flex-col '>
            
            <div className='w-full h-[12vh] flex flex-col '>
              <label htmlFor='email'>Email </label>
              
              <input id='email' {...register('email', { required: true })} className='h-[6vh]  rounded-lg outline-none text-black p-2' type='email'></input>
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
            
            <div className='w-full h-[10vh] flex flex-col justify-center items-center'>
              <button className='h-[6vh] w-[50%] bg-blue-600 rounded-2xl' type='submit'>Login</button>
            </div>
          </form>
          <hr />
          <h1>Or Login With</h1>
          <div onClick={LoginwithGoogle}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          </svg>
          </div>
          <div className='h-fit w-full flex flex-row justify-center items-center '>
            <img className='Introicon h-[7vh] w-auto' src={Logoimg}></img>
            <h1 className='text-lg'>Don't have an Account ??? <span onClick={handleSignupNav} className=' text-blue-600 underline cursor-pointer'>SignUp</span></h1>
          </div>
        </div>
      </div>
      <ToastContainer ></ToastContainer>

    </div>
  );
}

export default LogIn;
