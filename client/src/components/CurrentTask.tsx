import { useTaskContext, ITask } from "../context/taskContext";
import { useTimer } from "react-timer-hook";
import addPadding from "../addPadding";
import ProgressBar from "@ramonak/react-progress-bar";
import Pet from "./Pet";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Howl } from "howler";
import { Link } from "react-router-dom";
const analogAlarmClock = require("../198841__bone666138__analog-alarm-clock.mp3");

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

  // Format hours, minutes and seconds
  const hoursStr = hours.toString().length === 1 ?
    addPadding(hours.toString()) : hours.toString()
  ;
  const minutesStr = minutes.toString().length === 1 ?
    addPadding(minutes.toString()) : minutes.toString()
  ;
  const secondsStr = seconds.toString().length === 1 ?
    addPadding(seconds.toString()) : seconds.toString()
  ;

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
      <p className="info">Time remaining before it starts:</p>
      {hours > 0 ? <span>{hoursStr}</span> : null}
      {hours > 0 ? ":" : null}
      <span>{minutesStr}</span>:
      <span>{secondsStr}</span>
      <br />
    </div>
  );
};

interface NextTwoTasksProps {
  tasks: ITask[];
  currentTask: ITask;
};

const NextTwoTasks = ({ tasks, currentTask }: NextTwoTasksProps) => {
  const startIndex = tasks.indexOf(currentTask);
  const nextTwoTasks = tasks.slice(startIndex + 1, startIndex + 3);

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

interface CurrentTaskProps {
  role: string;
}

const CurrentTask = ({ role }: CurrentTaskProps) => {
  const [{ currentTask, tasks, upcomingTask }, dispatch] = useTaskContext();
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [isTurnedOff, setIsTurnedOff] = useState(false);

  const alarm: MutableRefObject<Howl | null> = useRef<Howl | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current &&
      currentTask && tasks.indexOf(currentTask) === 0 && !isAlarmPlaying && alarm.current) {
      buttonRef.current.dispatchEvent(new Event("click"));
    }
  }, [currentTask, isAlarmPlaying, tasks]);

  useEffect(() => {
    alarm.current = new Howl({
      src: [analogAlarmClock],
      html5: true,
    });

    const handleClick = () => {
      if (alarm.current) {
        alarm.current.play();
      }
    };

    if (currentTask && tasks.indexOf(currentTask) === 0 && !isAlarmPlaying) {
      buttonRef.current &&
        buttonRef.current.addEventListener("click", handleClick, { once: true });
    }

    let button: HTMLButtonElement;
    if (buttonRef.current) {
      button = buttonRef.current;
    }

    return () => {
      button && button.removeEventListener("click", handleClick);
    };
  }, [isAlarmPlaying, currentTask, tasks]);

  const handleTurnOff = () => {
    setIsTurnedOff(true);
    setIsAlarmPlaying(false);

    if (alarm.current) {
      alarm.current.stop();
      alarm.current.off();
    }
  };

  const handleTaskCompletion = () => {
    if (currentTask) {
      dispatch({
        type: "EDIT_TASK",
        payload: {
          tasks,
          task: { ...currentTask, isCompleted: true },
        },
      });
    }
  };

  return (
    <div className="task-details container-fluid">
      {role === "child" ? (
      <>
        <div className="d-flex justify-content-center align-items-center">
          <div className="current-task container-fluid text-center">
            {currentTask && (
              <>
                <button
                  title="play alarm"
                  type="button"
                  ref={buttonRef}
                  className="alarm-play-btn"
                >
                </button>
                <Pet />
                <br />
                <br />
                <h3 className="task-title">{currentTask.title}</h3>
                <TaskTimer expiryTimestamp={currentTask.endTime} isUpcomingTask={false} />
                {!isTurnedOff && tasks.indexOf(currentTask) === 0 && (
                  <>
                    {isAlarmPlaying ? (
                      <button
                        title="turn off alarm"
                        type="button"
                        onClick={handleTurnOff}
                        className="icon-button"
                      >
                        <i className="fa fa-circle-check"></i>
                      </button>
                    ) : (
                      <button
                        title="mark task as completed"
                        type="button"
                        onClick={handleTaskCompletion}
                        className="icon-button"
                      >
                        <i className="fa fa-circle-check"></i>
                      </button>
                    )}
                  </>
                )}
              </>
              )}
              {upcomingTask && (
                <>
                  <Pet />
                  Your upcoming task:
                  <h3>{upcomingTask.title}</h3>
                  <TaskTimer expiryTimestamp={upcomingTask.startTime} isUpcomingTask={true} />
                  {!isTurnedOff && tasks.indexOf(upcomingTask) === 0 && (
                    <>
                      {isAlarmPlaying ? (
                      <button
                        title="turn off alarm"
                        type="button"
                        onClick={handleTurnOff}
                        className="icon-button"
                      >
                        <i className="fa fa-circle-check"></i>
                      </button>
                    ) : (
                      <button
                        title="mark task as completed"
                        type="button"
                        onClick={handleTaskCompletion}
                        className="icon-button"
                      >
                        <i className="fa fa-circle-check"></i>
                      </button>
                    )}
                  </>
                )}
                {<div className="d-flex justify-content-center">
                  {upcomingTask && <NextTwoTasks tasks={tasks} currentTask={upcomingTask} />}
                </div>}
              </>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-center">
          {currentTask && <NextTwoTasks tasks={tasks} currentTask={currentTask} />}
        </div>
        {tasks.length === 0 && <p>No tasks to show or all tasks completed!</p>}
      </>
      ) : (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="current-task container-fluid text-center">
              {currentTask && (
                <>
                  <h3 className="task-title">{currentTask.title}</h3>
                  <TaskTimer expiryTimestamp={currentTask.endTime} isUpcomingTask={false} />
                  <button
                    title="mark task as completed"
                    type="button"
                    onClick={handleTaskCompletion}
                    className="icon-button"
                  >
                    <i className="fa fa-circle-check"></i>
                  </button>
                  <br />
                  <Link to="/edit-task" className="edit-task-link btn btn-primary link-item">
                    Edit Task
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentTask;