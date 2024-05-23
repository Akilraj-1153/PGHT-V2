import React from 'react';
import { Detector } from 'react-detect-offline';

const CheckConnection = ({ img, children }) => {
  return (
    <Detector
      render={({ online }) => (
        online ? children : (
          <div className='flex flex-col items-center justify-center w-screen h-screen gap-2 text-red-900 font-bold p-4'>
            <img className='h-32 w-auto md:h-48 lg:h-64' src={img} alt='Offline Illustration' />
            <h1 className='text-2xl md:text-3xl lg:text-5xl text-center'>You are currently offline</h1>
          </div>
        )
      )}
    />
  );
};

export default CheckConnection;
