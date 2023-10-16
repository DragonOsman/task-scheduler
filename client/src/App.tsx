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
  const [view, setView] = useState("parent");
  const [buttonClicked, setButtonClicked] = useState<HTMLButtonElement>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Routes>
        {view === "parent" ? (
          <>
            <Header />
            <button
              type="button"
              title="parent-view"
              onClick={(event) => {
                setButtonClicked(event.currentTarget);
              } }
              className="btn btn-primary"
            >
              Parent
            </button>
            <button
              type="button"
              title="child-view"
              onClick={(event) => {
                setButtonClicked(event.currentTarget);
                setView("child");
              } }
              className="btn btn-primary"
            >
              Child
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              title="parent-view"
              onClick={(event) => {
                setButtonClicked(event.currentTarget);
              } }
              className="btn btn-primary"
            >
              Parent
            </button>
            <button
              type="button"
              title="child-view"
              onClick={(event) => {
                setButtonClicked(event.currentTarget);
                setView("child");
              } }
              className="btn btn-primary"
            >
              Child
            </button>
          </>
        )}
        <br />
        {(buttonClicked && buttonClicked.textContent && buttonClicked.textContent === "Parent") && (
          <form
            onSubmit={event => {
              event.preventDefault();
              if (state.currentUser && buttonClicked) {
                if (state.currentUser.password && state.currentUser.password === password
              && state.currentUser.username && state.currentUser.username === username) {
                  if (buttonClicked.textContent && buttonClicked.textContent === "Parent") {
                    setView("parent");
                  }
                }
              }
            }}
            className="container-fluid"
          >
            <fieldset className="container-fluid">
              <legend className="mb-3">Re-enter Login Credentials</legend>
              <label htmlFor="username" className="form-label">Username:</label>
              <input
                type="text"
                title="username"
                name="username"
                className="form-control"
                value={username}
                onChange={event => setUsername(event.target.value)}
                required
              />
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                title="password"
                name="password"
                className="form-control"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
              />
            </fieldset>
            <input type="submit" value="Submit" className="btn-secondary" />
          </form>
        )}
        <br />
        <Route path="/" element={state.currentUser ? <Home view={view} /> : <Login />} />
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
