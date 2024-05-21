import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '../0 NavBar/NavBar'
// import AddHabits  from '../4 AddHabits/AddHabits'
// import MyHabits from '../5 MyHabits/MyHabits'
// import BMI from '../6 BMI/BMI'
import Profile from '../7 Profile/Profile'
import HomePage from '../4 Home/HomePage';
import ProfileEdit from '../9 ProfileEdit/ProfileEdit';

function MainApp() {


  return (
    <div className='h-screen w-screen '>
      <div className=' h-[10vh] md:h-[7vh] w-full'>
        <NavBar />
      </div>
      <div className=' h-[90vh] md:h-[93vh] w-full flex justify-center items-center'>
          <Routes>
            <Route path="/homepage/*" element={<HomePage />} ></Route>
            {/* <Route path="/addhabits/*" element={<AddHabits />} /> */}
            {/* <Route path="/myhabits/*" element={<MyHabits />} /> */}
            {/* <Route path="/bmi/*" element={<BMI />} /> */}
            <Route path="/profile/*" element={<Profile />} />
            <Route path='/editprofile' element={<ProfileEdit></ProfileEdit>}></Route>
          </Routes>
      </div>
    </div>
  );
}

export default MainApp;

