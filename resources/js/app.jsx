import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrudApp from "./components/CrudApp";
import Success from "./components/Success";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CrudApp />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
