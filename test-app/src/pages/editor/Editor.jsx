import React, { useState, useEffect, useRef,useContext } from 'react'
// import User from '../../components/User/User';
import TextArea from '../../components/Textarea/TextArea';
import toast, { Toaster } from 'react-hot-toast';
import Aside from '../../components/aside/aside';

import { useLocation, Navigate, useParams } from 'react-router-dom'
import codeContext from '../../context/codeState/codeContext';

import './Editor.css'

import io from 'socket.io-client';
const socket = io.connect('http://192.168.10.133:5000')

const Editor = () => {


  const location = useLocation();
  const { roomID } = useParams();
  const [users, setUsers] = useState([]);
  const [currUsername, setCurrUsername] = useState('');
  const [currUserSocket, setCurrUserSocket] = useState('');
  const codeRef = useRef(null);
  const currentCotext=useContext(codeContext);

  if(!roomID || !location.state ||!location.state?.username){ 
    return <Navigate to="/"></Navigate>

  }


  useEffect(() => {
    const init = async () => {

      socket.emit('join', { roomID, username: location.state?.username });

      socket.on('currentUser',({socketID,userCode})=>{
      
        // setCurrUserSocket(socketID);
        localStorage.setItem('currSocket', socketID);
        currentCotext.setOwnerSocket(socketID)
        currentCotext.updateCode(userCode);
      })

      socket.on('joined',async ({ roomUsers, username, socketID }) => {


        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
        }
        setUsers(roomUsers); 
        socket.emit('sync_code', { code: codeRef.current, socketID,roomID });
      });

      socket.on('disconnected', ({ socketID, username }) => {
        toast.success(`${username} left the room`);

        setUsers((prev_users) => {
          return prev_users.filter(user => user.socketID !== socketID)
        });
      })

      setCurrUsername(location.state?.username || '')

    
    }

    init();
   
  }, [])


  if (!location.state) {
    return <Navigate to="/"></Navigate>
  }


  return (
    <div className='editor-container'>
      <Toaster />


      <Aside users={users} roomID={roomID} currUser={currUsername} ></Aside>
     
      <div className="editor-wrapper">
        <TextArea socket={socket} roomID={roomID} onCodeChange={(code) => {
          codeRef.current = code;
        }} />
      </div>
    </div>
  )
}

export default Editor