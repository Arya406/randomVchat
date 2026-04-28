import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import VoiceChat from "./components/VoiceChat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<VoiceChat />} />
    </Routes>
  );
}

export default App;