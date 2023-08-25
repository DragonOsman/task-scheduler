import { useTimer } from "react-timer-hook";
import { useTaskContext } from "../context/taskContext";
import addPadding from "../addPadding";
import { useEffect } from "react";

interface TaskTimerProps {
  expiryTimestamp: Date;
};

const TaskTimer = ({ expiryTimestamp }: TaskTimerProps) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start
  } = useTimer({ expiryTimestamp, onExpire: () => <p>Time is up!</p> });

  useEffect(() => {
    if (!isRunning) {
      start();
    }
  }, [isRunning, start]);

  return (
    <div className="task-timer">
      <span>{days.toString().length === 1 && addPadding(days.toString())}</span>:
      <span>{hours.toString().length === 1 && addPadding(hours.toString())}</span>:
      <span>{minutes.toString().length === 1 && addPadding(minutes.toString())}</span>:
      <span>{seconds.toString().length === 1 && addPadding(seconds.toString())}</span>
      <br />
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
            className={`task-item ${task.isCompleted ? "completed" : ""}
              ${task === state.currentTask ? "current-task" : ""}`}
          >
            <b>{task.title}</b>
            {task === state.currentTask &&
              <TaskTimer expiryTimestamp={task.endTime} />}
            <button
              type="button"
              title="mark task as completed"
              onClick={() => {
                dispatch({ type: "EDIT_TASK", payload: {
                  currentTask: state.currentTask,
                  tasks: state.tasks, task: {
                    ...task,
                    isCompleted: true
                  }
                } });
              }}
              className="btn btn-primary"
            >
              Done
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListTasks;