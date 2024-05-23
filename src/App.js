import React from 'react'
import ImageContext from './HandleData/ImageContext'
import Logoimg from './Assets/logo.png'
import Intro from './Components/Intro/Intro'
import SignUp from './Components/Auth/SignUp'
import LogIn from './Components/Auth/LogIn'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LoginState } from './HandleData/atoms'
import { useEffect } from 'react'
import MainApp from './Components/MainApp/MainApp'
import CheckConnection from './Components/Network/CheckConnection'
import offlineimg from './Assets/offline-icon.png'


function App() {
  const navigation =useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  const [logo]=useState(Logoimg)

  useEffect(() => {
   
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!user); 
  }, []);

  return (
    <CheckConnection img={offlineimg}>
  <ImageContext.Provider value={logo}>
      <div className='h-screen w-screen  bg-black text-white'>
        <Routes>
          <Route path='/' element={ <Intro Logoimg={Logoimg}></Intro>}></Route>
          <Route path='/signup' element={<SignUp Logoimg={Logoimg}></SignUp>}></Route>
          <Route path='/login' element={!isLoggedIn &&  <LogIn Logoimg={Logoimg}></LogIn>}></Route>
          <Route path='/mainApp/*' element={isLoggedIn && <MainApp Logoimg={Logoimg}></MainApp>}></Route>
        </Routes>
        </div>
    </ImageContext.Provider>
    </CheckConnection>
      
  )
}

export default App