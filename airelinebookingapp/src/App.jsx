import { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Registration from "./components/auth/Registration";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Registration />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
