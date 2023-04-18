const express = require("express");
const app = express();
const cors=require('cors');

const users={};
const userCode=[];

app.use(cors());

app.get('/user',(req,res)=>{
  res.send("hello")
})

const server = app.listen(5000, () =>
  console.log(`Running in port 5000`)
);

function getAllConnectedUsers(roomID){
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map((socketID)=>{
    return {socketID,username:users[socketID]}
  })
}


const io = require("socket.io")(server,{
  cors: {
    origin: "http://192.168.10.133:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  
  socket.on("join",({roomID,username})=>{
    
    users[socket.id]=username;

    userCode.push({socketID:socket.id,roomID,username,code:''})

    socket.join(roomID);

    const roomUsers=getAllConnectedUsers(roomID);

    io.to(socket.id).emit('currentUser',{socketID:socket.id,userCode});
    
    roomUsers.forEach(({socketID})=>{
      io.to(socketID).emit("joined",{roomUsers,username,socketID:socket.id});
    })
    
  });

  socket.on("disconnecting",()=>{
    const rooms=[...socket.rooms];

    let username=users[socket.id];
    

    rooms.forEach((roomID)=>{
      socket.in(roomID).emit("disconnected",{
        socketID:socket.id,
        username
      });

      delete users[socket.id];
      socket.leave();
    });
    
    
  });

  socket.on('code_change',({roomID,code,socketID})=>{
    
    userCode.forEach((user,i)=>{
      if(user.roomID==roomID && user.socketID==socketID){
        userCode[i].code=code;
      }

    });
    
    const updatedCode=userCode.filter((user)=>{
      return user.roomID==roomID;
    });    
    
    const roomUsers=getAllConnectedUsers(roomID);

    roomUsers.forEach(({socketID})=>{
      io.to(socketID).emit("code_change",{updatedCode});
    });    
    
  });

  socket.on("sync_code",({code,socketID,roomID})=>{
    const updatedCode=userCode.filter((user)=>{
      return user.roomID==roomID;
    }); 
     
    socket.to(socketID).emit("code_change",{updatedCode});
  });

});

