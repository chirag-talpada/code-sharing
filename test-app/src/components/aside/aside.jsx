import React, { useEffect } from 'react'
import User from '../../components/User/User';
import './aside.css'
import toast from 'react-hot-toast';

function Aside({ users, roomID, currUser }) {


 

  if(users.length!=0){
    let curr;
    users.forEach((user,i) => {
      if(user.username==currUser){
        curr=users.splice(i,1);
      }
    });
    users.unshift(curr[0]);
  }  

  const copyToClipboard = async () => {
    try {

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(roomID);
        toast.success("Room ID Copied")
        return
      }

      const existingID = document.getElementById('rid');
      if (existingID) {
        document.getElementById('rid').remove();
      }
      let txt = document.createElement('input');
      txt.setAttribute('type', 'text');
      txt.setAttribute('value', roomID);
      txt.setAttribute('id', 'rid');

      document.querySelector('.title').appendChild(txt);

      document.getElementById('rid').focus();
      document.getElementById('rid').select();
      document.execCommand('copy');
      document.getElementById('rid').style.display = 'none';
      toast.success("Room ID Copied")


    } catch (err) {
      console.log(err);
      toast.error("Can not Copied Room ID")
    }
  }

  const leaveRoom = () => {
    window.location.href = "/"
  }




  return (
    <div className="aside">
      <div className='logo'>
        CodeStream
      </div>
      <hr />


      <div className="connected-user-container">
        <div className="title">
          Connected
        </div>
        <div className="user-list">
          {
            users.map((user) => <User currUser={currUser} socketID={user.socketID} key={user.socketID} username={user.username} />)
          }
        </div>
      </div>

      <div className="button-box">
        <div>
          <button className='copy-roomid-btn' onClick={copyToClipboard} >Copy Room ID</button>
        </div>
        <div>
          <button className='leave-btn' onClick={leaveRoom}>leave</button>
        </div>
      </div>

    </div>
  )
}

export default Aside