import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Config/Config';
import { myHabits, selectedHabitsforReport } from '../../HandleData/atoms';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdCloseCircle } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import OneSignal from 'react-onesignal';

const OneSignalAppId = 'YOUR_ONESIGNAL_APP_ID';

function HabitReport({ habit }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [AllHabits, setAllHabits] = useRecoilState(myHabits);
  const [HabitForReport, setHabitForReport] = useRecoilState(selectedHabitsforReport);
  const [dataFetched, setDataFetched] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [notifyTime, setNotifyTime] = useState('');

  useEffect(() => {
    OneSignal.init({
      appId: '2247f176-0a44-473d-985a-8ad111a31b8c',
      notifyButton: {
        enable: true,
      },
    });
    fetchHabitData();
  }, [HabitForReport]);

  useEffect(() => {
    setTotalDays(selectedDates.length);
  }, [selectedDates]);

  useEffect(() => {
    if (dataFetched) {
      saveDatesToFirestore();
    }
  }, [selectedDates, dataFetched]);

  const fetchHabitData = async () => {
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const docRef = doc(db, 'HabitDetails', userEmail);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const habitData = docSnap.data().Habits || {};
        if (habitData[HabitForReport]) {
          setSelectedDates(habitData[HabitForReport].Date || []);
          setNotifyTime(habitData[HabitForReport].NotifyTime || '');
          setAllHabits(habitData);
          setDataFetched(true);
        }
      }
    } catch (error) {
      console.error('Error fetching habit data:', error);
    }
  };

  const handleDateClick = (date) => {
    const updatedSelectedDates = [...selectedDates];
    const isAlreadySelected = selectedDates.includes(date);
    
    if (isAlreadySelected) {
      updatedSelectedDates.splice(updatedSelectedDates.indexOf(date), 1);
    } else {
      updatedSelectedDates.push(date);
    }
    setSelectedDates(updatedSelectedDates);
  };

  const saveDatesToFirestore = async () => {
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const docRef = doc(db, 'HabitDetails', userEmail);
    const data = { ...AllHabits, [HabitForReport]: { ...AllHabits[HabitForReport], Date: selectedDates, NotifyTime: notifyTime } };
    try {
      await setDoc(docRef, { Habits: data });
    } catch (error) {
      toast.error('Error updating user details!', { autoClose: 2000 });
    }
  };

  const isDateSelected = (date) => selectedDates.includes(date);

  const deleteHabit = async (habitname) => {
    try {
      const updatedHabits = { ...AllHabits };
      delete updatedHabits[habitname];
      setAllHabits(updatedHabits);
      const userEmail = JSON.parse(localStorage.getItem('user')).email;
      const userDocRef = doc(db, 'HabitDetails', userEmail);
      await setDoc(userDocRef, { Habits: updatedHabits });
      setHabitForReport(null);
      toast.success('Habit deleted successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit. Please try again later.', { autoClose: 2000 });
    }
  };

  const handleNotifyTimeSave = async () => {
    await saveDatesToFirestore();
    setIsNotify(false);
    scheduleDailyNotification(notifyTime);
    toast.success('Notification time saved successfully!', { autoClose: 2000 });
  };

  const handleNotifyTimeChange = (event) => {
    setNotifyTime(event.target.value);
  };

  const scheduleDailyNotification = (time) => {
    const [hours, minutes] = time.split(':');
    const notifyTime = new Date();
    notifyTime.setHours(hours);
    notifyTime.setMinutes(minutes);
    notifyTime.setSeconds(0);

    OneSignal.sendSelfNotification(
      "Habit Reminder",
      "It's time to follow your habit!",
      "",
      { data: { habit } },
      [{ title: "Check now", action: "check" }]
    );
  };

  return (
    <div className="habit-report text-center h-full w-full rounded-xl p-2 overflow-hidden">
      {!isNotify && (
        <>
          <div className='h-[3vh] w-full flex justify-end items-end'>
            <button className='' onClick={() => setHabitForReport(null)}><IoMdCloseCircle size='20' color='white'/></button>
          </div>
          <div className='h-fit lg:h-1/3 w-full gap-2 flex justify-center items-center flex-col'>
            <div className='flex gap-5 w-full h-full justify-center items-center'>
              <h2 className="text-lg font-bold w-fit">{habit} Report</h2>
              <button className='h-fit  text-md md:text-2xl font-bold border-2 border-blue-500 p-2 rounded-md w-fit text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300' onClick={() => deleteHabit(habit)}>Delete</button>
              <button className='h-fit  text-md md:text-2xl font-bold border-2 border-blue-500 p-2 rounded-md w-fit text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300' onClick={() => setIsNotify(true)}>
                <FaBell />
              </button>
            </div>
            <div className="intro-text text-sm lg:text-md mb-6 w-full">
              <p>Track your progress for {habit} habit below. Click on each day to mark it as followed or not followed.</p>
            </div>
          </div>
          <div className='h-2/3 w-full'>
            <div className="calendar myhabit w-full h-full overflow-scroll">
              <div className="month">
                <h3 className="rounded-xl text-xl font-semibold mb-2">
                  {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })} {currentTime.getFullYear()}
                </h3>
                <div className="days grid grid-cols-4 md:grid-cols-7 gap-1">
                  {[...Array(new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate())].map((_, dayIndex) => {
                    const date = new Date(currentTime.getFullYear(), currentTime.getMonth(), dayIndex + 1).toLocaleDateString();
                    const isMarked = isDateSelected(date);
                    const buttonColor = isMarked ? 'bg-green-500' : 'bg-gray-500';

                    return (
                      <div key={dayIndex} className="day flex flex-col justify-center items-center cursor-pointer" onClick={() => handleDateClick(date)}>
                        <div className={`rounded-md border-2 w-3/4 shadow-xl p-2 ${buttonColor}`}>
                          {dayIndex + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {totalDays === 0 ? (
                <div className="empty-state-message text-gray-600 mt-8">
                  <p>No progress tracked yet. Start tracking your habit now!</p>
                </div>
              ) : (
                <div className="total-days mt-4">Total Days Followed: {totalDays}</div>
              )}
            </div>
          </div>
        </>
      )}
      {isNotify && (
        <div className='text-black flex justify-center items-center h-full w-full flex gap-5 flex-col'>
          <input
            type='time'
            className='outline-none p-2'
            value={notifyTime}
            onChange={handleNotifyTimeChange}
          />
          <p className='text-white'>You'll receive daily notifications at the set time.</p>
          <div className='flex gap-5'>
            <button
              className='h-fit  text-md md:text-2xl font-bold border-2 border-blue-500 p-2 rounded-md w-fit text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300'
              onClick={handleNotifyTimeSave}
            >
              Save
            </button>
            <button
              className='h-fit  text-md md:text-2xl font-bold border-2 border-blue-500 p-2 rounded-md w-fit text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300'
              onClick={() => setIsNotify(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default HabitReport;
