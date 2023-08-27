import { useTaskContext } from "../context/taskContext";
import { useTimer } from "react-timer-hook";
import addPadding from "../addPadding";
import ProgressBar from "@ramonak/react-progress-bar";
import Pet from "./Pet";
import { useState } from "react";

interface TaskTimerProps {
  expiryTimestamp: Date;
}

const TaskTimer = ({ expiryTimestamp }: TaskTimerProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp, onExpire: () => setErrorMessage("Time is up!") });

  // Calculate the progress percentage and total seconds
  const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  const progressPercentage = (totalSeconds / (expiryTimestamp.getTime() / 1000)) * 100;

  // Format minutes and seconds
  const minutesStr = minutes.toString().length === 1 ?
    addPadding(minutes.toString()) : minutes.toString();
  const secondsStr = seconds.toString().length === 1 ?
  addPadding(seconds.toString()) : seconds.toString();

  return (
    <div className="task-timer">
      <ProgressBar
        completed={progressPercentage}
        bgColor="black"
        animateOnRender={true}
        height="8px"
        borderRadius="0px"
      />
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {new Date().getTime() >= expiryTimestamp.getTime() && (
        <p className="text-danger">
          You are taking too long to complete this task and taking time away from the next one!
        </p>
      )}
      <span>{minutesStr}</span>:
      <span>{secondsStr}</span>
      <br />
    </div>
  );
};

const CurrentTask = () => {
  const [{ currentTask, tasks }, dispatch] = useTaskContext();
  let nextTwoTasks: typeof tasks = [];

  if (currentTask) {
    const startIndex = tasks.indexOf(currentTask);
    nextTwoTasks = tasks.slice(startIndex + 1, startIndex + 3);
  }

  return (
    <div className="task-details container-fluid">
      <div className="d-flex justify-content-center align-items-center">
        <div className="current-task container-fluid text-center">
          {currentTask && (
            <>
              <Pet />
              <br />
              <br />
              <h3 className="task-title">{currentTask.title}</h3>
              <TaskTimer expiryTimestamp={currentTask.endTime} />
              <i
                className="fa-solid fa-circle-check"
                title="mark task as completed"
                onClick={() => {
                  dispatch({
                    type: "EDIT_TASK",
                    payload: {
                      tasks,
                      task: { ...currentTask, isCompleted: true },
                    }
                  });
                }}
              ></i>
            </>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="next-two-tasks text-center">
          <p>{nextTwoTasks.length > 0 &&
            `Your next ${nextTwoTasks.length === 1 ? "task:" : "two tasks:"}`}</p>
          <ul className="tasks container-fluid row">
            {nextTwoTasks.map((task) => {
              return (
                <li key={task.id} className={`task ${nextTwoTasks.length === 1 ?
                  "col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" :
                  "col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                }`}>
                  {task.title}
                  {task.flexible && new Date(task.startTime) <= new Date() &&
                    <TaskTimer expiryTimestamp={task.endTime} />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {tasks.length === 0 && <p>No tasks to show or all tasks completed!</p>}
    </div>
  );
};

export default CurrentTask;