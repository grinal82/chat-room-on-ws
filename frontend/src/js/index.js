const chatSpace = document.getElementById('chat');

const ws = new WebSocket("ws://localhost:7070");

const sendMessageBtn = document.getElementById("send");

sendMessageBtn.addEventListener('click', function(event){
    event.preventDefault();
    chatMessage = document.getElementById("chat-message")
    message = chatMessage.value;
    // console.log(message)
    if(!message) {
        return
    }

    ws.send(JSON.stringify({
        'message':message,
    }))
    chatMessage.value = ""
})

ws.addEventListener("open", (e) => {
    // console.log(e);

    console.log("ws open");
});

ws.addEventListener("close", (e) => {
    // console.log(e);

    console.log("ws close");
});

ws.addEventListener("error", (e) => {
    // console.log(e);

    console.log("ws error");
});

ws.onmessage = (IncomingMessage) => {
    console.log(IncomingMessage);
    console.log(JSON.parse(IncomingMessage.data));
    const data = JSON.parse(IncomingMessage.data)
    const{ chat: messages } = data
    let created = new Date().toLocaleDateString()
    let time = new Date().toLocaleTimeString()
    messages.forEach((val) => {
        chatSpace.innerHTML += `
            <li class="clearfix">
                <div class="message-data text-right">
                    <span class="message-data-time">${time},  ${created}</span>
                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                </div>
                <div class="message other-message float-right"> ${val.message}</div>
            </li>`;
})};