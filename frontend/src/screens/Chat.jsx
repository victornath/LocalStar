import React from 'react'
import { io } from "socket.io-client";

const socket = io("http://localhost");
console.log(socket.connected)


const Chat = () => {
    const messageContainer = document.getElementById('message-container')
    const messageForm = document.getElementById('send-container')
    const messageInput = document.getElementById('message-input')

    const name = prompt('What is your name?')
    appendMessage('You joined')
    socket.emit('new-user', name)

    socket.on('chat-message', data => {
        appendMessage(`${data.name}: ${data.message}`)
    })

    socket.on('user-connected', name => {
        appendMessage(`${name} connected`)
    })

    socket.on('user-disconnected', name => {
        appendMessage(`${name} disconnected`)
    })

    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        appendMessage(`You: ${message}`)
        socket.emit('send-chat-message', message)
        messageInput.value = ''
    })

    function appendMessage(message) {
        const messageElement = document.createElement('div')
        messageElement.innerText = message
        messageContainer.append(messageElement)
    }

    return (
        <>
            <div id="message-container"></div>
            <form id="send-container">
                <input type="text" id="message-input"></input>
                <button type="submit" id="send-button">Send</button>
            </form>
        </>
    )
}

export default Chat