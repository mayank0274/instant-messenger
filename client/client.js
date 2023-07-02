const socket = io();
const messageSec = document.querySelector(".message_sec");
const messageText = document.querySelector("textarea");
const sendBtn = document.querySelector("#sendMsg");
let name = prompt("enter your name");

// new user msg
socket.emit("user-joined", name);

const date = new Date();
const hours = date.getHours();
const min = date.getMinutes();
let dt = `${hours} : ${min} AM`;
if (hours == 12) {
  dt = `${hours} : ${min} PM`;
}
if (hours > 12) {
  dt = `${hours - 12} : ${min} PM`;
}

// append user join msg
socket.on("user-joined-msg", (name) => {
  appendInfoMsg(`${name} joined chat`);
});

const sendMsg = () => {
  if (!name) {
    name = prompt("enter your name");
  }
  const message = {
    msg: messageText.value,
    user: name,
    timestamp: dt,
  };

  // sending message : sendMsg event
  socket.emit("sendMsg", message);
  appendMsg(message, "outgoingMsg");
  messageText.value = "";
};

sendBtn.addEventListener("click", () => {
  sendMsg();
});

window.addEventListener("keydown", (key) => {
  if (key.code === "Enter") {
    sendMsg();
  }
});

//aapend chat msg
const appendMsg = (message, type) => {
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
};

// append info msg
const appendInfoMsg = (message) => {
  const msgElem = document.createElement("div");
  msgElem.classList.add("infoMsg");

  const html = `
       <p>${message}</p>
  `;

  msgElem.innerHTML = html;
  messageSec.appendChild(msgElem);
};

// listening event broadcastMsg to all except sender
socket.on("broadcastMsg", (message) => {
  appendMsg(message, "incomingMsg");
});

// left chat msg
socket.on("left-chat", (name) => {
  appendInfoMsg(`${name} left chat`);
});
