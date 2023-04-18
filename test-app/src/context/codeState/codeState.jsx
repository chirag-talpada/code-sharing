import codeContext from "./codeContext";
import { useState } from "react";



const CodeState=({children})=>{

    const [userCodes,setUserCodes]=useState([]);
    const [currentSocket,setCurrentSocket] = useState('');
    const [ownerSocket,setOwnerSocket] = useState('');

    const updateCode=(value)=>{
        setUserCodes(value)
    }

    const updateCurrentSocket=(socketID)=>{
        console.log(currentSocket);
        setCurrentSocket(socketID)
        console.log(currentSocket);
    }

    return (<codeContext.Provider value={{userCodes,currentSocket,ownerSocket,updateCode,updateCurrentSocket,setOwnerSocket}}>
        {children}
    </codeContext.Provider>)
}

export default CodeState