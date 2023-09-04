import "./App.css";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import { useTaskContext } from "./context/taskContext";
import { Routes, Route } from "react-router-dom";

function App() {
  const [{ task }] = useTaskContext();
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<AddTask />} path="/add-task" />
      </Routes>
    </>
  );
}

export default App;
