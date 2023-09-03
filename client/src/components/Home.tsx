import { useState } from "react";
import CurrentTask from "./CurrentTask";
import { Link } from "react-router-dom";

const Home = () => {
  const [userRole, setUserRole] = useState("child");

  return (
    <div className="home container-fluid">
      <div className="container-fluid d-flex justify-content-center
        text-center align-items-center flex-direction-column">
        <fieldset className="text-center">
          <legend>User Role:</legend>
          <label htmlFor="parent-role" className="form-label">Parent </label>
          <input
            type="radio"
            name="parent-role"
            id="parent"
            className="parent-role"
            checked={userRole === "parent" ? true : false}
            onChange={() => setUserRole("parent")}
            aria-label="parent"
          />
          <br />
          <label htmlFor="child-role" className="form-label">Child </label>
          <input
            type="radio"
            name="child-role"
            id="child"
            className="child-role"
            checked={userRole === "child" ? true : false}
            onChange={() => setUserRole("child")}
            aria-label="child"
          />
        </fieldset>
      </div>
      <div className="d-flex justify-content-center text-center align-items-center">
        {userRole === "child" ? (
          <CurrentTask role={userRole} />
        ) : (
          <Link to="/add-task" className="btn btn-secondary">Add Task</Link>
        )}
      </div>
    </div>
  );
};

export default Home;