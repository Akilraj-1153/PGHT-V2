import React, { useEffect } from 'react';
import { Detector } from 'react-detect-offline';
import gsap from 'gsap';

const CheckConnection = ({ img,children }) => {
 

  return (
    <Detector
      render={({ online }) => (
        online ? children : (
          <div className='flex flex-col items-center justify-center w-screen h-screen gap-2 text-red-900 lg:text-2xl font-bold'>
            <img className='h-[50%] w-auto' src={img}></img>
            <h1 className='text-5xl'>You are currently offline</h1>
          </div>
        )
      )}
    />
  );
};

export default CheckConnection;
