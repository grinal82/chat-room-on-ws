const chatSpace = document.getElementById("chat");
const sendMessageBtn = document.getElementById("send");

const ws = new WebSocket("ws://localhost:7070");

// отправка содержимого формы на сервер
sendMessageBtn.addEventListener("click", function (event) {
    event.preventDefault();
    chatMessage = document.getElementById("chat-message");
    message = chatMessage.value;
    if (!message) {
        return;
    }
    ws.send(
        JSON.stringify({
            message: message,
        })
    );
    chatMessage.value = "";
});

// Listeners на различные события websocket'a
ws.addEventListener("open", (e) => {
    console.log(e);
    console.log("ws open");
});

ws.addEventListener("close", (e) => {
    console.log(e);
    console.log("ws close");
});

ws.addEventListener("error", (e) => {
    console.log(e);
    console.log("ws error");
});

// Обработка полученных сообщенийы
ws.onmessage = (incomingMessage) => {
    console.log(incomingMessage);
    try {
        const data = JSON.parse(incomingMessage.data);
        const messages = Array.isArray(data) ? data : []; // проверка является ли data массивом
        let created = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();
        messages.forEach((val) => {
            const { message } = val; // Получаем'message'
            chatSpace.innerHTML += `
                <li class="clearfix">
                    <div class="message-data text-right">
                        <span class="message-data-time">${time}, ${created}</span>
                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                    </div>
                    <div class="message other-message float-right">${message}</div>
                </li>`;
        });
    } catch (error) {
        console.error("Error parsing incoming message data:", error);
    }
};
