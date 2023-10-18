/* eslint-disable linebreak-style */
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { useContext, useState } from "react";
import CurrentTask from "./components/CurrentTask";
import ListTasks from "./components/ListTasks";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import AddChild from "./components/AddChild";

function App() {
  const { state } = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={state.currentUser ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-child" element={<AddChild />} />
        {state.currentUser && state.currentUser.children ? (
          <>
            <Route path="/tasks" element={<ListTasks />} />
            <Route path="/current-task" element={<CurrentTask />} />
            {state.currentUser.children.map(child => (
              <Route
                key={child.firstName}
                path={`/${child.firstName.toLowerCase()}-page`}
                element={<CurrentTask />}
              />
            ))}
          </>
        ) : (
          <>
            <Route path="/tasks" element={
              <>
                <p className="text-danger">You must be logged in to see this page!</p>
              </>
            } />
            <Route path="/current-task" element={
              <>
                <p className="text-danger">You must be logged in to see this page!</p>
              </>
            } />
            <Route path="/add-child" element={
              <>
                <p className="text-danger">You must be logged in to see this page!</p>
              </>
            } />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
