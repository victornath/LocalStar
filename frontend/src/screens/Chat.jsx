import React from 'react'
import { io } from "socket.io-client";
import { useSelector } from "react-redux";


const socket = io("http://localhost:5000");
console.log(socket.connected)


const Chat = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    React.useEffect(() => {
        let messageContainer
        let messageForm
        let messageInput

        async function loadData(url) {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userInfo.token,
                }
            });
            return await response.json()
        }

        let userData
        loadData("/api/users/getData").then(data => {
            userData = data
        })


        const name = "test name"
        socket.emit('new-user', name)

        socket.on('chat-message', data => {
            appendMessage(`${userData.name}: ${data.message}`)
        })

        socket.on('user-connected', name => {
            appendMessage(`${userData.name} connected`)
        })

        socket.on('user-disconnected', name => {
            appendMessage(`${userData.name} disconnected`)
        })

        messageContainer = document.getElementById('message-container')
        messageInput = document.getElementById('message-input')
        messageForm = document.getElementById('send-container')

        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            appendMessage(`${userData.name}: ${message}`)
            socket.emit('send-chat-message', message)
            messageInput.value = ''
        })

        function appendMessage(message) {
            const messageElement = document.createElement('div')
            messageElement.innerText = message
            messageContainer.append(messageElement)
        }
    })

    return (
        <div>
            <div id="message-container"></div>
            <form id="send-container">
                <input type="text" id="message-input"></input>
                <button type="submit" id="send-button">Send</button>
            </form>
        </div>
    )
}

export default Chat