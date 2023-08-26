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

  // Use remainingTime if available, otherwise use the timer hook
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
        bgColor="blue"
        animateOnRender={true}
        className="progress-bar"
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
    <div className="task-details">
      <div className="current-task">
        {currentTask && (
          <>
            <Pet />
            <br />
            <br />
            <h3 className="task-title">{currentTask.title}</h3>
            <p className="task-is-recurring">Recurring: {currentTask.isRecurring ? "Yes" : "No"}</p>
            <TaskTimer expiryTimestamp={currentTask.endTime} />
            <button
              type="button"
              title="mark task as completed"
              className="btn btn-primary"
              onClick={() => {
                dispatch({
                  type: "EDIT_TASK",
                  payload: {
                    tasks,
                    task: { ...currentTask, isCompleted: true },
                  },
                });
              }}
            >
              Done
            </button>
          </>
        )}
      </div>
      <div className="next-two-tasks">
        <p>{nextTwoTasks.length > 0 && `Your next ${nextTwoTasks.length === 1 ? "task:" : "two tasks:"}`}</p>
        <ul className="tasks">
          {nextTwoTasks.map((task) => (
            <li key={task.id}>
              {task.title}
              <TaskTimer expiryTimestamp={task.endTime} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrentTask;