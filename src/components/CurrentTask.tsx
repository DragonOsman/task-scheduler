import { useTaskContext } from "../context/taskContext";
import { useTimer } from "react-timer-hook";
import { Link } from "react-router-dom";
import addPadding from "../addPadding";

interface TaskTimerProps {
  expiryTimestamp: Date;
};

const TaskTimer = ({ expiryTimestamp }: TaskTimerProps) => {
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp, onExpire: () => <p>Time is up!</p> });

  const daysStr = days.toString();
  const hoursStr = hours.toString();
  const minutesStr = minutes.toString();
  const secondsStr = seconds.toString();

  return (
    <div className="task-timer">
      <span>{daysStr.length === 1 ? addPadding(daysStr) : daysStr}</span>:
      <span>{hoursStr.length === 1 ? addPadding(hoursStr) : hoursStr}</span>:
      <span>{minutesStr.length === 1 ? addPadding(minutesStr) : minutesStr}</span>:
      <span>{secondsStr.length === 1 ? addPadding(secondsStr) : secondsStr}</span>
      <br />
    </div>
  );
};

const CurrentTask = () => {
  const [state, dispatch] = useTaskContext();
  let nextTwoTasks: typeof state.tasks = [];

  if (state.currentTask) {
    const startIndex = state.tasks.indexOf(state.currentTask);
    nextTwoTasks = state.tasks.slice(startIndex + 1, startIndex + 3);
  }

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
          {nextTwoTasks && (
            nextTwoTasks.length > 1 ? "Your next two tasks:" :
              nextTwoTasks.length === 1 ? "Your next task:" : ""
          )}
        </p>
        <ul className="tasks">
          {nextTwoTasks && (
            nextTwoTasks.map(task => {
              return (
                <li key={task.id}>
                  {task.title}
                </li>
              );
            })
          )}
        </ul>
      </div>
      <Link to="/" className="back-to-home btn btn-primary">Back to Home</Link>
    </div>
  );
};

export default CurrentTask;