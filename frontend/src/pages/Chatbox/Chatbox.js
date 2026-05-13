import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function Main() {

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    checkToken();

    const newSocket = io("http://localhost:8080", {
      auth: {
        token: localStorage.getItem("token")
      }
    });
    setSocket(newSocket);

    newSocket.on('message', (type, text) => {
      setMessages(prev => [...prev, [type, text]]);
    });

    newSocket.emit('message', 'welcomeText', "");
    return () => newSocket.disconnect(); // cleanup
  }, []);

  const checkToken = async () => {
    if (!localStorage.getItem("token")) window.location.href = "/";

    try {
      if (!localStorage.getItem("token")) {
        window.location.href = "/";
        return;
      }
      let response = await fetch("http://localhost:8080/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token: localStorage.getItem("token")})
      });
      let data = await response.json();
      if (!response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } catch (e) {
      console.log ("Erro: ", e);
      window.location.href = "/";
    }
  }

  const sendMessage = () => {
    if (!socket) return;
    socket.emit('message', 'normalText', inputValue);
    setInputValue("");
  };

  const exitChat = () => {
    socket.emit('message', 'leaveText', "");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="falling-bg absolute inset-0"></div>

      <div className="relative z-10 w-[95%] max-w-4xl h-[85vh] bg-black border border-lime-custom rounded-lg shadow-[0_0_5px_#00ff00] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-lime-custom px-4 py-3">
          <h1 className="border-lime-custom text-lime-custom font-mono">[@chat]</h1>

          <button onClick={exitChat} className="border border-lime-custom text-lime-custom px-3 py-1 rounded hover:bg-lime-custom hover:text-black transition font-mono">
            Sair
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-4 space-y-2 font-mono border-lime-custom">
          {messages.map(([type, message], index) => {
            if (type === "welcomeText") {
              return (
                <li key={index} className="border border-lime-700 text-lime-custom bg-[#0c490c] px-3 py-2 rounded break-words shadow-[0_0_3px_#00ff0020]">
                  {message}
                </li>
              );
            } else if (type === "leaveText") {
              return (
                <li key={index} className="border border-red-800 text-red-500 bg-[#1f0101] px-3 py-2 rounded break-words shadow-[0_0_3px_#ff000020]">
                  {message}
                </li>
              );
            } else if (type === "normalText") {
              return (
                <li key={index} className="border border-lime-800 text-lime-custom bg-[#011f01] px-3 py-2 rounded break-words shadow-[0_0_3px_#00ff0020]">
                  {message}
                </li>
              );
            }

          })}
        </ul>

        <div className="border-t border-lime-custom p-4 flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} placeholder="..." className="flex-1 bg-black border text-lime-custom border-lime-custom p-3 rounded outline-none font-mono" />

          <button onClick={sendMessage} className="border border-lime-custom px-5 rounded text-lime-custom hover:bg-lime-custom hover:text-black transition font-mono">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

