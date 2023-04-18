import React, { useEffect, useState,useRef,useContext } from 'react'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

import codeContext from '../../context/codeState/codeContext';




const TextArea = ({socket,roomID,onCodeChange}) => {

    const [code, setCode] = useState('');
    const editorRef = useRef(null)

    const currentCotext=useContext(codeContext);

    const updateCode=()=>{
        let codes=currentCotext.userCodes;

        

        codes.forEach((userCode)=>{
           
            if(userCode.socketID==currentCotext.currentSocket){
   
                editorRef.current.setValue(userCode.code);

                if(userCode.socketID!=currentCotext.ownerSocket){
                    document.querySelector('.CodeMirror').firstChild.style.display='none'
                }else{
                    document.querySelector('.CodeMirror').firstChild.style.display='block'
                }
               
            }
        });
    }

    useEffect(() => {

      

        async function init() {
            editorRef.current=CodeMirror.fromTextArea(document.getElementById('code-editor'), {
                lineNumbers: true,
                mode: 'javascript',
                theme: 'material',
                autoCloseTags: true,
                autoCloseBrackets: true,
                smartIndent: true,
                
            });

            editorRef.current.on('change',(instance,changes)=>{
                const {origin} = changes;
                const code=instance.getValue();
                onCodeChange(code);

                if(origin!=='setValue'){
                    socket.emit('code_change',{
                        roomID,code,socketID:socket.id
                    })
                }
            });

            socket.on('code_change',({updatedCode})=>{

                if(updatedCode){
                    currentCotext.updateCode(updatedCode);
                }

                

            });

        }

        init();

    }, []);

    useEffect(()=>{
        
        updateCode();

    },[currentCotext.currentSocket])


    const handleChange = (event) => {
        setCode(event.target.value);
    };

    return (
        <textarea id='code-editor' value={code}
            onChange={handleChange}></textarea>
    )
}

export default TextArea