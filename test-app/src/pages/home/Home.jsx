import React, { useCallback,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import toast, { Toaster } from 'react-hot-toast';
import { option2,option1 } from '../../components/particles/config';
import { v4 as uuidv4 } from 'uuid';

import './Home.css'
import logo from '../../assets/logo.png'


const Home = () => {

  const [roomID,setroomID]=useState('');
  const [username,setUsername]=useState('');
  const navigate = useNavigate();

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {

  }, []);


  let generateNewID=function(){
    let id = uuidv4();
    toast.success('Created a new room')
    setroomID(id);
  }

  let joinRoom = function(){

    if(!username || !roomID){
      toast.error('Username or roomID is required');
      return 
    }

    navigate(`/editor/${roomID}`,{state:{username}})


  }

  return (
    <div>
      <Toaster/>
      <Particles id="tsparticles" options={option2} init={particlesInit} loaded={particlesLoaded} />

      <div className="homeContainer">
        <div className="formDiv">
          <div>
            <img className='logo-img' src={logo} alt="" srcSet="" />
          </div>
          <div className="inputBoxContainer">
            <div className='input'>
                <input type="text" name="roomID" id="roomID" onChange={(e)=>setroomID(e.target.value)} value={roomID} placeholder='Room ID' />
            </div>
            <div className='input'>
                <input type="text" name="username" id="username" onKeyUp={(e)=>{if(e.key==="Enter")joinRoom()}} onChange={(e)=>setUsername(e.target.value)} placeholder='Username' />
            </div>
            <div className='input'>
                <button className='join-btn' onClick={joinRoom}>Join</button>
            </div>
            
            <div className='newRoom-link'>
                if you don't have an ID then create <a onClick={generateNewID} >new room</a>
            </div>


          </div>
        </div>
      </div>


    </div>
  )
}

export default Home