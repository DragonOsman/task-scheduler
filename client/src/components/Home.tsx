import { useState } from "react";
import CurrentTask from "./CurrentTask";
import { Link } from "react-router-dom";

const Home = () => {
  const [userRole, setUserRole] = useState("child");

  return (
    <div className="Home container-fluid">
      <fieldset>
        <legend>User Role:</legend>
        <input
          type="radio"
          name="parent-role"
          id="parent"
          className="parent-role"
          checked={userRole === "parent" ? true : false}
          onSelect={() => setUserRole("parent")}
          aria-label="parent"
        />
        <input
          type="radio"
          name="child-role"
          id="child"
          className="child-role"
          checked={userRole === "child" ? true : false}
          onSelect={() => setUserRole("child")}
          aria-label="child"
        />
      </fieldset>
      {userRole === "child" ? (
        <CurrentTask role={userRole} />
      ) : (
        <Link to="/add-task">Add Task</Link>
      )}
    </div>
  );
};

export default Home;