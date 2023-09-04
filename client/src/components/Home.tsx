import { useState } from "react";
import CurrentTask from "./CurrentTask";
import ListTasks from "./ListTasks";
import { Link } from "react-router-dom";
import { Howl } from "howler";
import analogAlarmClock from "../198841__bone666138__analog-alarm-clock.mp3";

const Home = () => {
  const [userRole, setUserRole] = useState("child");
  const alarm = new Howl({
    src: [analogAlarmClock],
    html5: true
  });

  return (
    <div className="home container-fluid">
      <div className="container-fluid d-flex justify-content-center
        text-center align-items-center flex-direction-column">
        <fieldset className="text-center">
          <legend>User Role:</legend>
          <label htmlFor="parent-role" className="form-label">Parent</label>
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
          <label htmlFor="child-role" className="form-label">Child</label>
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
      <div className="d-flex justify-content-center text-center
        align-items-center flex-direction-column">
        {userRole === "child" ? (
          <CurrentTask role={userRole} alarmSound={alarm} />
        ) : (
          <div className="task-list-container">
            <ListTasks alarmSound={alarm} />
            <Link to="/add-task" className="btn btn-secondary">Add Task</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;