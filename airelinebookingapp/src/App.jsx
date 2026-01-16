import { useState } from "react";

import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
