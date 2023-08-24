import { useTaskContext } from "../context/taskContext";
import { useState } from "react";
import { useTimer } from "react-timer-hook";

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
      <br />
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

const CurrentTask = () => {
  const [state, dispatch] = useTaskContext();
  const startIndex = state.currentTask && state.tasks.indexOf(state.currentTask);
  const nextTwoTasks = (state.currentTask && startIndex) &&
    state.tasks.slice(startIndex + 1, startIndex + 3);

  return (
    <div className="task-details">
      <div className="current-task">
        {state.currentTask && (
          <>
            <h2 className="task-title">Title: {state.currentTask.title}</h2>
            <p className="task-is-recurring">
              Recurring: {state.currentTask.isRecurring ? "Yes" : "No"}
            </p>
            <TaskTimer expiryTimestamp={state.currentTask.endTime} />
            Days recurring:
            {state.currentTask.isRecurring && (
              <ul className="days-recurring">
                {state.currentTask.daysRecurring.map(day => {
                  return (
                    <li key={day}>
                      {`${state.currentTask
                        && state.currentTask.daysRecurring[
                          state.currentTask.daysRecurring.length - 1]
                           === day ? `${day}` : `${day}, `}`}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="next-two-tasks">
        <p>
          {nextTwoTasks && nextTwoTasks.length > 1 ? "Your next two tasks"
            : "Your next task"}:
          {nextTwoTasks && nextTwoTasks.map((task, index) => {
            return (
              <span>{index === 1 ? `${task.title}, ` : task.title}</span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

export default CurrentTask;