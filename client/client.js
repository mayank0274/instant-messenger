const socket = io()
const messageSec = document.querySelector(".message_sec");
const messageText = document.querySelector("textarea");
const sendBtn = document.querySelector("#sendMsg");
const name = prompt("enter your name");

const date = new Date();
const hours = date.getHours();
const min = date.getMinutes();
let dt = `${hours} : ${min} AM`;
if(hours==12){
 dt = `${hours} : ${min} PM`
}
if(hours>12){
dt = `${hours -12} : ${min} PM`;
}

sendBtn.addEventListener("click",()=>{
  if(!name){
    name = prompt("enter your name")
  }
    const message = {
    msg : messageText.value,
    user : name,
    timestamp : dt,
  }
  
  // sending message : sendMsg event 
  socket.emit("sendMsg", message);
  appendMsg(message,"outgoingMsg");
  messageText.value = "";
})

const appendMsg = (message,type)=>{
  const msgElem = document.createElement("div");
  msgElem.classList.add("message", type);
 
  const html = `
        <p>${message.user}</p>
        <p>
          ${message.msg}
        </p>
        <p id="timestamp">${dt}</p>
  `;
  
  msgElem.innerHTML = html;
  messageSec.appendChild(msgElem);
  
}

// listening event broadcastMsg to all except sender
socket.on("broadcastMsg",(message)=>{
  appendMsg(message,"incomingMsg")
})
