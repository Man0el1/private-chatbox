import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.js"
import Footer from "./components/Footer/Footer.js"

import Main from "./pages/Main/Main.js";
//import Chat from "./pages/Chat/Chat.js";
//<Route path="/chat" element={<Chat/>}/>

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>}/>
      </Routes>
    </Router>
  );
}
