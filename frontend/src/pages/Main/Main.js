import React, { useState, useRef } from "react";

export default function Main() {
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const fallingBgRef = useRef(null);

  const showRedBg = () => {
    console.log("Erro: ", data.message);
    if (fallingBgRef.current) {
      fallingBgRef.current.style.filter = "hue-rotate(-90deg) brightness(2)";
      setTimeout(() => {
        fallingBgRef.current.style.filter = "none";
      }, 500);
    }
    return;
  }

  const enterChat = async (e) => {
    e.preventDefault();
    if (nameValue === "" || nameValue.length > 30 || passwordValue === "" || passwordValue.length > 100) return;
    try {
      let response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: nameValue, password: passwordValue})
      });
      let data = await response.json();

      if (!response.ok) {
        showRedBg();
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/chat";
    } catch (e) {
      console.error("Erro: ", e);
    }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="falling-bg absolute inset-0" ref={fallingBgRef}></div>
      <form onSubmit={enterChat} className="relative z-10 bg-black flex flex-col items-center border border-lime-custom p-6 rounded-lg shadow-[0_0_3px_#00ff00]">
        <input type="text" placeholder="Nome" value={nameValue} onChange={(e) => setNameValue(e.target.value.slice(0,30))} className="bg-black border border-lime-custom text-lime-custom p-2 rounded-md mb-2 w-full max-w-xs outline-none focus:shadow-[0_0_5px_#00ff00]" />
        <input type="text" placeholder="Senha" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value.slice(0,100))} className="bg-black border border-lime-custom text-lime-custom p-2 rounded-md mb-2 w-full max-w-xs outline-none focus:shadow-[0_0_5px_#00ff00]" />
        <input type="submit" value="Entrar" className="bg-black border border-lime-custom text-lime-custom rounded-md text-[1.2rem] p-2.5 mt-5 cursor-pointer hover:bg-lime-custom hover:text-black transition" />
      </form>
    </div>
  );
}
