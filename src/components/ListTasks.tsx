import { useTimer } from "react-timer-hook";
import { useTaskContext } from "../context/taskContext";
import { useState } from "react";
import { Link } from "react-router-dom";

interface TaskTimerProps {
  expiryTimestamp: Date;
};

const TaskTimer = ({ expiryTimestamp }: TaskTimerProps) => {
  const [newExpiryTimestamp, setNewExpiryTimestamp] = useState("00:00:00");
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart
  } = useTimer({ expiryTimestamp, onExpire: () => <p>Time is up!</p> });

  return (
    <div className="task-timer">
      <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      {isRunning ? (
        <button
          type="button"
          title="stop timer"
          onClick={() => pause()}
          className="btn btn-warning"
        >
          Pause
        </button>
      ) : (
        <>
          <button
            type="button"
            title="start timer"
            onClick={() => start()}
            className="btn btn-primary"
          >
            Start
          </button>
          <button
            type="button"
            title="resume timer"
            onClick={() => resume()}
            className="btn btn-primary"
          >
            Resume
          </button>
          <button
            type="button"
            title="restart timer"
            onClick={() => restart(new Date(newExpiryTimestamp))}
            className="btn btn-primary"
          >
            Restart
          </button>
          <p>Enter new deadline for timer (to use when restarting the timer):</p>
          <input
            type="datetime"
            name="new-end-time"
            title="new deadline for timer"
            onChange={event => setNewExpiryTimestamp(event.target.value)}
            value={newExpiryTimestamp}
            placeholder="Enter new value for timer deadline"
          />
        </>
      )}
    </div>
  );
};

const ListTasks = () => {
  const [state, dispatch] = useTaskContext();

  return (
    <div>
      <h3>My Chores</h3>
      <ul className="task-list container-fluid">
        {state.tasks.map(task => (
          <li
            key={task.id}
            className={`task-item ${task.isCompleted ? "completed" : ""}`}
          >
            {task.title}
            <TaskTimer expiryTimestamp={task.endTime} />
            <button
              type="button"
              title="mark task as completed"
              onClick={() => {
                dispatch({ type: "EDIT_TASK", payload: {
                  tasks: state.tasks, task: {
                    ...task,
                    isCompleted: true
                  }
                } });
              }}
              className="btn btn-primary"
            >
              Complete
            </button>
            <button
              type="button"
              title="delete task"
              onClick={() => {
                dispatch({ type: "DELETE_TASK", payload: {
                  tasks:
                    state.tasks.filter((currentTask) => task.id !== currentTask.id)
                  }
                });
              }}
              className="btn btn-danger"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <Link to="/add-task">Add New Task</Link>
    </div>
  );
};

export default ListTasks;