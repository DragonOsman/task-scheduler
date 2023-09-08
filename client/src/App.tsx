import "./App.css";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import CurrentTask from "./components/CurrentTask";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<AddTask />} path="/add-task" />
        <Route element={<CurrentTask />} path="/current-task" />
      </Routes>
    </>
  );
}

export default App;
