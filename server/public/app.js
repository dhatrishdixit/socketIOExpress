const form = document.querySelector('form');
const input = document.querySelector('input');
const ul = document.querySelector('ul');
const socket = io("ws://localhost:3500");
const activity = document.querySelector('.activity');


let name = prompt('write your name');
while(name == "" || name == null){
  name = prompt('write your name'); 
}
console.log(name);
socket.emit('userName',name)

const sendMessage = (e) =>{
    e.preventDefault();
    
    if(input.value){
        const message = [name,input.value];
        socket.emit('message',message);
        input.value=""
    }
    else{
        window.alert('Enter message first');
    }
    
}
const recieveHandler = (data) =>{
    activity.textContent="";
    const textNode = document.createTextNode(data) ;
    const li = document.createElement('li');
    li.appendChild(textNode);
    ul.appendChild(li);
}
form.addEventListener('submit',sendMessage);
input.addEventListener('keypress',(e)=>{
      socket.emit('active',name);
})
window.addEventListener('keypress',(e)=>{
    if(e.key === "Enter"){
       sendMessage(e);
    }
},false)

socket.on("message",data=>{
    console.log(data);
    recieveHandler(data);
});

let activityTimer ;
socket.on('activity',name=>{
     activity.textContent = `${name} is typing ....`
     clearTimeout(activityTimer);
     activityTimer = setTimeout(()=>{
        activity.textContent = ""
     },2000)
})