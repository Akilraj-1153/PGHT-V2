import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '../NavBar/NavBar'
import AddHabits  from '../AddHabits/AddHabits'
import MyHabits from '../MyHabits/MyHabits'
import BMI from '../BMI/BMI'
import Profile from '../Profile/Profile'
import HomePage from '../Home/HomePage';
import ProfileEdit from '../ProfileEdit/ProfileEdit';

function MainApp() {


  return (
    <div className='h-screen w-screen '>
      <div className=' h-[10vh] md:h-[7vh] w-full'>
        <NavBar />
      </div>
      <div className=' h-[90vh] md:h-[93vh] w-full flex justify-center items-center'>
          <Routes>
            <Route path="/homepage/*" element={<HomePage />} ></Route>
            <Route path="/addhabits/*" element={<AddHabits />} />
            <Route path="/myhabits/*" element={<MyHabits />} />
            <Route path="/bmi/*" element={<BMI />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path='/editprofile' element={<ProfileEdit></ProfileEdit>}></Route>
          </Routes>
      </div>
    </div>
  );
}

export default MainApp;

