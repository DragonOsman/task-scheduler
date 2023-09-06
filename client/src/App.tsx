import "./App.css";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import { Routes, Route } from "react-router-dom";
import CurrentTask from "./components/CurrentTask";
import { useState } from "react";

function App() {
  const roleState = useState("child");

  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<AddTask />} path="/add-task" />
        <Route element={<CurrentTask role={roleState[0]} />} path="/current-task" />
      </Routes>
    </>
  );
}

export default App;
