const express = require('express');
const { Server } = require('socket.io');
const path = require('path')
const app = express() ;

app.use(express.static(path.join(__dirname,'public')))
const PORT = process.env.port || 4000 ;

const expressServer = app.listen(PORT,()=>{
  console.log(`server is working in ${PORT}`);
})


const io = new Server(expressServer)


io.on('connection',socket=>{
      
      let userName = {};      
      socket.on('userName',(username)=>{
      userName[socket.id] = username ; 
      console.log('user is connected',socket.id,userName[socket.id]);
      //message to all on connection except the user 
      socket.broadcast.emit('message',`${userName[socket.id]} is ONLINE`)

      //message to user on connection 
      socket.emit('message',`${userName[socket.id]} welcome to chat app`)
      })
   

      // upon user sending message to others
      socket.on('message',data=>{
        console.log(data);
        io.emit('message',`${data[0]}: ${data[1]} `)
      })
      //upon user disconnect 
      socket.on("disconnect",reason=>{
        socket.broadcast.emit('message',`${userName[socket.id]} has disconnected`)
        console.log(`${userName[socket.id]} is disconnected because of reason :${reason}`)
      })
      
      //listen for activity 
      socket.on('active',(name)=>{
          socket.broadcast.emit('activity',name);
          
      });
})
