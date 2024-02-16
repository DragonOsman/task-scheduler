/* eslint-disable linebreak-style */
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { useContext } from "react";
import CurrentTask from "./components/CurrentTask";
import ListTasks from "./components/ListTasks";
import Home from "./components/Home";
import Header from "./components/Header";

function App() {
  const { state } = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
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
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
