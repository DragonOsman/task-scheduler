import { useTaskContext } from "../context/taskContext";
import { useTimer } from "react-timer-hook";
import addPadding from "../addPadding";
import ProgressBar from "@ramonak/react-progress-bar";

interface TaskTimerProps {
  expiryTimestamp: Date;
}

const TaskTimer = ({ expiryTimestamp }: TaskTimerProps) => {
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp, onExpire: () => console.log("Time is up!") });

  // getting amount of time elapsed as a percentage by getting and using the total
  // num of seconds
  const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  const progressPercentage = (totalSeconds / (expiryTimestamp.getTime() / 1000)) * 100;

  const daysStr = days.toString().length === 1 ?
    addPadding(days.toString()) :
    days.toString()
  ;
  const hoursStr = hours.toString().length === 1 ?
    addPadding(hours.toString()) :
    hours.toString()
  ;
  const minutesStr = minutes.toString().length === 1 ?
    addPadding(minutes.toString()) :
    minutes.toString()
  ;
  const secondsStr = seconds.toString().length === 1 ?
    addPadding(seconds.toString()) :
    seconds.toString()
  ;

  return (
    <div className="task-timer">
      <ProgressBar
        completed={progressPercentage}
        bgColor="blue"
        animateOnRender={true}
        className="progress-bar"
      />
      <span>{daysStr}</span>:
      <span>{hoursStr}</span>:
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
            <h2 className="task-title">Title: {currentTask.title}</h2>
            <p className="task-is-recurring">
              Recurring: {currentTask.isRecurring ? "Yes" : "No"}
            </p>
            <TaskTimer expiryTimestamp={currentTask.endTime} />
            <button
              type="button"
              title="mark task as completed"
              className="btn btn-primary"
              onClick={() => {
                dispatch({ type: "EDIT_TASK", payload: {
                  tasks,
                  task: { ...currentTask, isCompleted: true }
                } });
              }}
            >
              Done
            </button>
          </>
        )}
      </div>
      <div className="next-two-tasks">
        <p>
          {nextTwoTasks.length > 0 &&
            `Your next ${nextTwoTasks.length === 1 ? "task:" : "two tasks:"}`}
        </p>
        <ul className="tasks">
          {nextTwoTasks.map(task => (
            <li key={task.id}>
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrentTask;