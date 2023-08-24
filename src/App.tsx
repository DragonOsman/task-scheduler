import "./App.css";
import Home from "./components/Home";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import CurrentTask from "./components/CurrentTask";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<AddTask />} path="/add-task" />
        <Route element={<CurrentTask />} path="/current-task" />
      </Routes>
    </>
  );
}

export default App;
