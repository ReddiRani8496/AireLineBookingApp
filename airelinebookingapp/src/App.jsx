import { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Registration from "./components/auth/Registration";
import Login from "./components/auth/Login";
import HomePage from "./components/pages/HomePage";
import FindFlight from "./components/pages/FindFlight";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FindFlight />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
