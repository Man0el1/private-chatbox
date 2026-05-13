import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.js"
import Footer from "./components/Footer/Footer.js"

import Main from "./pages/Main/Main.js";
import Chatbox from "./pages/Chatbox/Chatbox.js";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/chatbox" element={<Chatbox/>}/>
      </Routes>
    </Router>
  );
}
