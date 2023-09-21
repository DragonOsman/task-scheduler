/* eslint-disable linebreak-style */
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { useContext } from "react";
import CurrentTask from "./components/CurrentTask";
import ListTasks from "./components/ListTasks";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";

function App() {
  const { state } = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={state.currentUser ? <Home /> : <Login />} />
        <Route path="/tasks" element={<ListTasks />} />
        <Route path="/current-task" element={<CurrentTask />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
