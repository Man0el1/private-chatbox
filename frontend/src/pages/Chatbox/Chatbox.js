import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

import './Chatbox.css'

export default function Main() {

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on('message', (text) => {
      setMessages(prev => [...prev, text]);
    });

    return () => newSocket.disconnect(); // cleanup
  }, []);

  const checkToken = async () => {
    if (!localStorage.getItem("token")) window.location.href = "/";

    try {
      let response = await fetch("http://localhost:8080/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({token: localStorage.getItem("token")})
      });
      let data = await response.json();
    } catch (e) {
      console.log ("Erro: ", e);
      window.location.href = "/";
    }
  }

  const sendMessage = () => {
    if (!socket) return;
    socket.emit('message', inputValue);
    setInputValue("");
  };

  return(
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="falling-bg absolute inset-0" ref={fallingBgRef}></div>
      <div className="relative z-10 bg-black flex flex-col items-center border border-lime-custom p-6 rounded-lg shadow-[0_0_3px_#00ff00]">
      </div>
      <ul className="messages">
        {messages.map((msg, index) => (<li key={index}>{msg}</li>))}
      </ul>
    </div>
  )
}

