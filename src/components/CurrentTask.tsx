import { useTaskContext, ITask } from "../context/taskContext";
import { useTimer } from "react-timer-hook";
import addPadding from "../addPadding";
import ProgressBar from "@ramonak/react-progress-bar";
import Pet from "./Pet";
import { useState } from "react";

interface TaskTimerProps {
  expiryTimestamp: Date;
  isUpcomingTask: boolean;
}

const TaskTimer = ({ expiryTimestamp, isUpcomingTask }: TaskTimerProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [messageForTask, setMessageForTask] = useState("");  // for when timer for
                                                             // upcoming task expires
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
    if (isUpcomingTask) {
      setMessageForTask("Please start working on this task now, before time runs out!");
    } else {
      setErrorMessage("Time is up!");
    }
  } });

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
      )}{isUpcomingTask && <p className="text-primary">{messageForTask}</p>}
      <span>{minutesStr}</span>:
      <span>{secondsStr}</span>
      <br />
    </div>
  );
};

interface NextTwoTasksProps {
  tasks: ITask[];
};

const NextTwoTasks = ({ tasks }: NextTwoTasksProps) => {
  const nextTwoTasks = tasks.slice(1, 3);

  return (
    <div className="next-two-tasks text-center">
      {nextTwoTasks.length > 0 && (
        <>
          <p>{`Your next ${nextTwoTasks.length === 1 ? "task:" : "two tasks:"}`}</p>
          <ul className="tasks container-fluid">
            {nextTwoTasks.map((task) => (
              <li
                key={task.id}
                className="task"
              >
                {task.title}
                {task.flexible && new Date(task.startTime) <= new Date() && (
                  <TaskTimer expiryTimestamp={task.endTime} isUpcomingTask={false} />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const CurrentTask = () => {
  const [{ currentTask, tasks, upcomingTask }, dispatch] = useTaskContext();

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
              <TaskTimer expiryTimestamp={currentTask.endTime} isUpcomingTask={false} />
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
          {upcomingTask && (
            <>
              Your upcoming task:
              <h3>{upcomingTask.title}</h3>
              <TaskTimer expiryTimestamp={upcomingTask.startTime} isUpcomingTask={true} />
            </>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <NextTwoTasks tasks={tasks} />
      </div>
      {tasks.length === 0 && <p>No tasks to show or all tasks completed!</p>}
    </div>
  );
};

export default CurrentTask;