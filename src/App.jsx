import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "/src/pages/Home";
import About from "/src/pages/About";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
