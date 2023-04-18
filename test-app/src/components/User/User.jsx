import React,{useContext,useEffect} from 'react'
import Avatar from 'react-avatar'

import './User.css'

import codeContext from '../../context/codeState/codeContext';

const User = ({username,currUser,socketID}) => {

  
  const currentCotext=useContext(codeContext);

  const showUserCode=(e) => {
    
    const allUsers = document.querySelectorAll('.user-box');
    allUsers.forEach((user) => {
      user.classList.remove('activate-user');
    })
    e.target.closest('.user-box').classList.add('activate-user')
    let user=e.target.closest('.user-box').getAttribute('data-user');
    currentCotext.updateCurrentSocket(user);
  }

  return (
    <div className={'user-box '+(username==currUser?'activate-user':'')} data-user={socketID} onClick={showUserCode} >
        <Avatar name={username} size={40} round="14px" />
        <div className='uname'>{username}</div>
    </div>
  )
}

export default User