import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../Config/Config';
import { myHabits, selectedHabitsforReport } from '../../HandleData/atoms';
import HabitReport from '../HabitReport/HabitReport';

function MyHabits() {
  const [AllHabits, setAllHabits] = useRecoilState(myHabits);
  const [HabitForReport, setHabitForReport] = useRecoilState(selectedHabitsforReport);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const userEmail = JSON.parse(localStorage.getItem('user')).email;
        const userHabitRef = doc(db, 'HabitDetails', userEmail);
        const userHabitSnapshot = await getDoc(userHabitRef);

        if (userHabitSnapshot.exists()) {
          const userHabit = userHabitSnapshot.data();
          setAllHabits(userHabit.Habits);
        } else {
          toast.error('User Habits not found!', { autoClose: 2000 });
        }
      } catch (error) {
        toast.error('Failed to fetch Habits!', { autoClose: 2000 });
      }
    };

    fetchHabits();
  }, []);

  const handleReport = (habit) => {
    setHabitForReport(habit);
  };

  const sortedHabits = () => {
    if (AllHabits) {
      return Object.keys(AllHabits).sort((a, b) => {
        const dateA = new Date(AllHabits[a].AddedAt);
        const dateB = new Date(AllHabits[b].AddedAt);
        return dateA - dateB; // Ascending order
      });
    }
    return [];
  };

  return (
    <div className='h-full w-full flex justify-center items-center gap-5 xs:flex-col sm:flex-row'>
      <div className='xs:h-[30%] xs:w-[80%] sm:h-[90%] sm:w-[40%] lg:w-[20%] border-2 rounded-xl p-2 overflow-hidden'>
        <h1 className='text-center font-mateSc p-2'>My Habits</h1>
        <div className='myhabit h-fit max-h-[90%] overflow-scroll'>
          {AllHabits &&
            sortedHabits().map((habit, index) => (
              <div key={habit} className='text-black p-2 w-full flex justify-center items-center'>
                <p
                  className='flex cursor-pointer justify-center items-center w-[80%] h-fit text-center p-2 rounded-sm bg-white shadow-sm shadow-white'
                  onClick={() => handleReport(habit)}
                >
                  {habit}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className='xs:h-[60%] xs:w-[80%] sm:h-[90%] sm:w-[50%] lg:w-[70%] border-2 rounded-xl'>
        {HabitForReport ? (
          <HabitReport habit={HabitForReport} />
        ) : (
          <div className='text-white text-center flex justify-center items-center h-full w-full'>
            Select the Habit To view its Report
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default MyHabits;
