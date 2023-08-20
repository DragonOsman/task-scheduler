import { useState, useEffect } from "react";
import data from "../data.json";
import { useTimer } from "react-timer-hook";

const amiraTasks = data["Amira"]["Chores"];
const nooraTasks = data["Noora"]["Chores"];

interface ITask {
  id: number;
  title: string;
  startTime: Date;
  endTime?: Date;
  isRecurring: boolean;
  isCompleted: boolean;
};

const convertToValidTasks = (data: typeof amiraTasks): ITask[] => {
  const newData: ITask[] = [];
  for (const outerValue of Object.values(data)) {
    for (const [innerKey, innerValue] of Object.entries(outerValue)) {
      const task: ITask = {
        id: 0,
        title: "",
        startTime: new Date(),
        endTime: new Date(),
        isRecurring: false,
        isCompleted: false
      };

      if (innerKey === "title" && typeof innerValue === "string") {
        task.title = innerValue;
      }

      if (innerKey === "startTime" && typeof innerValue === "string") {
        const newValue = new Date(innerValue);
        task.startTime = newValue;
      } else if (innerKey === "endTime" && typeof innerValue === "string") {
        const newValue = new Date(innerValue);
        task.endTime = newValue;
      }

      task.id = newData.length > 0 ?
        newData[newData.length - 1].id + 1 : 0;

      // no end time for recurring tasks
      if (task.isRecurring) {
        task.endTime = undefined;
      }
      newData.push(task);
    }
  }
  return newData;
};

interface TaskTimeProps {
  expiryTimestamp: Date;
};

const TaskTimer = ({ expiryTimestamp }: TaskTimeProps) => {
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
          className="pause-timer-btn"
        >
          Pause
        </button>
      ) : (
        <>
          <button
            type="button"
            title="start timer"
            onClick={() => start()}
          >
            Start
          </button>
          <button
            type="button"
            title="resume timer"
            onClick={() => resume()}
          >
            Resume
          </button>
          <button
            type="button"
            title="restart timer"
            onClick={() => restart(new Date(newExpiryTimestamp))}
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

const Home = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [currentChild, setCurrentChild] = useState("Amira");

  const toggleCurrentChild = (child: string) => setCurrentChild(child);

  useEffect(() => {
    if (currentChild === "Amira") {
      setTasks(convertToValidTasks(amiraTasks));
    } else if (currentChild === "Noora") {
      setTasks(convertToValidTasks(nooraTasks));
    }
  }, [currentChild]);

  return (
    <>
      <h1>My Chores</h1>
      <h2>{currentChild}</h2>
      <button
        type="button"
        title="toggle child"
        onClick={() => {
          if (currentChild === "Amira") {
            toggleCurrentChild("Noora");
          } else {
            toggleCurrentChild("Amira");
          }
        }}
      >
        Toggle Child
      </button>
      <ul className="task-container">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className="task-item"
          >
            {task.title}
            {(!task.isRecurring && task.endTime) && (
              <TaskTimer expiryTimestamp={task.endTime} />
            )}
            <button
              type="button"
              title="completed?"
              className="complete-button"
              onClick={() => {
                setTasks(() => {
                  return tasks.map(task => (
                    {...task, isCompleted: true}
                  ));
                });
              }}
            >
              Complete
            </button>
            <button
              type="button"
              title="delete task"
              className="delete-task"
              onClick={() => {
                const deleteTask = (index: number) => {
                  const newTasks = tasks.filter(task => task.id !== tasks[index].id);
                  setTasks(newTasks);
                };
                deleteTask(index);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;