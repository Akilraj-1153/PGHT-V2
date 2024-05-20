import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { ProviderIds, userData, userEmail, userName } from '../../HandleData/atoms'
import { signOut } from 'firebase/auth';
import { auth, db, imagedb } from '../../Config/Config';
import { LoginState, UserDetails, Imagestate, DisplayGoogleAlert} from '../../HandleData/atoms';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { HabitQuotes } from '../../HandleData/Data';
import { myHabits } from '../../HandleData/atoms';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


function HomePage() {
  const [displayAlert, setDisplayAlert] = useRecoilState(DisplayGoogleAlert);
  const [provider, setProvider] = useRecoilState(ProviderIds);
  const [userDetails, setUserDetails] = useRecoilState(UserDetails);
  const [defaultUserImage, setDefaultUserImage] = useRecoilState(Imagestate);
  const [pghtuser, setPghtuser] = useRecoilState(userData);
  const [Name, setName] = useRecoilState(userName);
  const [Email, setEmail] = useRecoilState(userEmail);
  let [currentQuote,setCurrentQuote]=useState(0)

  const [AllHabits,setAllHabits]= useRecoilState(myHabits)

 

  useEffect(()=>{
    const user = localStorage.getItem('user')
    const useDetails = JSON.parse(user)
    setPghtuser(useDetails)
  },[])

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
         console.log(provider)

        const userEmail = JSON.parse(localStorage.getItem('user')).email;
        const userDocRef = doc(db, 'UserDetails', userEmail);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserDetails(userData);
          setEmail(userData.Email);
          setName(userData.Name);

          const imageRef = ref(imagedb, `/images/${userEmail}/${userEmail}`);
          getDownloadURL(imageRef)
            .then((url) => setDefaultUserImage(url))
            .catch((error) => console.error('Error fetching user image URL:', error));
        } else {
          console.log('User details not found');
        }

      } catch (error) {
        console.error('Error fetching user details:', error);
      }

    };

    fetchUserDetails();
  }, [provider, pghtuser, setDefaultUserImage, setUserDetails]);
  
  const navigation =useNavigate()
  function handleclick(){
    navigation('/mainApp/addhabits')
  }

  useEffect(()=>{
    const fetchHabits = async ()=>{
      try{
        const userEmail = JSON.parse(localStorage.getItem('user')).email;
        const userHabitRef =  doc(db, 'HabitDetails', userEmail);
          const userHabitSnapshot = await getDoc(userHabitRef);
          if (userHabitSnapshot.exists()){
            const userHabit = userHabitSnapshot.data();
            setAllHabits(userHabit.Habits)


          }
          else{
            console.log('User Habits not found');
  
          }
      }
      catch(error){
        console.log(error)
      }
    }
    fetchHabits()
  },[])
  

  useEffect(()=>{
    setTimeout(()=>{
      setCurrentQuote(prev => (prev === HabitQuotes.length - 1) ? 0 : prev + 1);
      console.log("rendered")
    },20000)
  },[currentQuote])


  // useGSAP(()=>{
  //   const tl =gsap.timeline()
  //   tl.fromTo('.Home',{y:100,opacity:0},{y:0,opacity:1})
  // },[])

  return (
    <div className=' Home h-[90vh] md:h-[93vh] w-screen bg-red-900  '>
      
    </div>
  )
}

export default HomePage