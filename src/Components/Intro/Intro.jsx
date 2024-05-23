import { useGSAP } from '@gsap/react'
import React, { useEffect } from 'react'
import { gsap } from 'gsap/gsap-core'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { LoginState } from '../../HandleData/atoms'


    function Intro({Logoimg}) {
        const navigation =useNavigate()
        const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);

        useEffect(() => {
   
            const user = JSON.parse(localStorage.getItem('user'));
            setIsLoggedIn(!!user); 
          }, []);

            useGSAP(()=>{
                gsap.fromTo('.Introicon',{scale:0.8},{scale:1,opacity:1,ease:'circ.in',duration:1})
            },[])

            if (isLoggedIn){
                setTimeout(()=>{
                    navigation('/mainapp/homepage')
                    
                    },'2000')
            } 
            else{
                    setTimeout(()=>{
                        navigation('/login')
                        console.log("app")
                        },'2000')
            }
                

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <img className='Introicon h-[30vh] w-[40v]' src={Logoimg}></img>
        </div>
    )
    }

    export default Intro