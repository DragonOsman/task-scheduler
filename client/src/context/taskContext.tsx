/* eslint-disable linebreak-style */
import { createContext, useReducer, useContext, useEffect, ReactNode } from "react";

export interface Task {
  _id?: string;
  title: string;
  text: string;
  startTime?: string;
  endTime?: string;
  startDate: Date;
  endDate: Date;
  timer: string;
  time: string;
  scheduled: boolean;
  flexible: boolean;
  isRecurring: boolean;
  daysRecurring?: string[];
  isCompleted: boolean;
  childName: string;
}

interface TaskState {
  tasks: Task[];
  currentTask?: Task;
  upcomingTask?: Task;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, task: Task) => void;
  deleteTask: (taskId: string, task: Task) => void;
}

const initialTaskState: TaskState = {
  tasks: [],
  currentTask: {
    _id: "",
    title: "",
    text: "",
    timer: "",
    time: "",
    startTime: "",
    endTime: "",
    startDate: new Date(),
    endDate: new Date(),
    scheduled: false,
    flexible: false,
    isCompleted: false,
    isRecurring: false,
    daysRecurring: [],
    childName: ""
  },
  upcomingTask: {
    _id: "",
    title: "",
    text: "",
    timer: "",
    time: "",
    startTime: "",
    endTime: "",
    startDate: new Date(),
    endDate: new Date(),
    scheduled: false,
    flexible: false,
    isCompleted: false,
    isRecurring: false,
    daysRecurring: [],
    childName: ""
  },
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
};

const TaskContext = createContext<TaskState>(initialTaskState);

type Action =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { taskId: string; task: Task } }
  | { type: "SELECT_CURRENT_TASK", payload: { currentTask: Task } }
  | { type: "SELECT_UPCOMING_TASK", payload: { upcomingTask: Task } }
  | { type: "DELETE_TASK"; payload: { taskId: string, task: Task } };

const taskReducer = (state: TaskState, action: Action): TaskState => {
  switch (action.type) {
  case "ADD_TASK":
    return {
      ...state,
      tasks: [...state.tasks, action.payload],
    };
  case "UPDATE_TASK":
    return {
      ...state,
      tasks: state.tasks.map((task) =>
        task._id === action.payload.taskId ? action.payload.task : task
      ),
    };
  case "DELETE_TASK":
    return {
      ...state,
      tasks: state.tasks.filter((task) => task._id !== action.payload.taskId),
    };
  case "SELECT_CURRENT_TASK":
    return {
      ...state,
      currentTask: action.payload.currentTask,
      tasks: state.tasks
    };
  case "SELECT_UPCOMING_TASK":
    return {
      ...state,
      upcomingTask: action.payload.upcomingTask,
      tasks: state.tasks
    };
  default:
    return state;
  }
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  const addTask = async (task: Task) => {
    dispatch({ type: "ADD_TASK", payload: task });
  };

  const updateTask = async (taskId: string, task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: { taskId, task } });
  };

  const deleteTask = async (taskId: string, task: Task) => {
    dispatch({ type: "DELETE_TASK", payload: { taskId, task } });
  };

  useEffect(() => {
    if (state.tasks.length > 0) {
      const currentTask = state.tasks.find(task => {
        return !task.isCompleted &&
        task.startDate.getTime() <= new Date().getTime() &&
        new Date().getTime() <= task.endDate.getTime();
      });
      if (currentTask) {
        dispatch({
          type: "SELECT_CURRENT_TASK",
          payload: {
            currentTask
          }
        });
      }
    }
  }, [state.tasks]);

  useEffect(() => {
    if (state.tasks.length > 0) {
      const currentTime = new Date();
      const upcomingTask = state.tasks.find(task => {
        const timeDifference = task.startDate.getTime() - currentTime.getTime();

        // Convert milliseconds to minutes
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        return !task.isCompleted && minutesDifference <= 30 && minutesDifference >= 0;
      });
      if (upcomingTask) {
        dispatch({
          type: "SELECT_UPCOMING_TASK",
          payload: {
            upcomingTask
          }
        });
      }
    }
  }, [state.tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await fetch(
          "../task-data.json", {
            headers: {
              "Content-Type": "application/json"
            }
          })
        ;

        if (tasksResponse.status >= 200 && tasksResponse.status < 300) {
          const data = await tasksResponse.json();
          for (const [key, value] of Object.entries(data["Amira"]["Chores"])) {
            const startDate = new Date();
            const endDate = new Date();
            let daysRecurring = [];
            let title = "";
            let isRecurring: boolean = false;
            let isCompleted: boolean = false;
            let scheduled: boolean = false;
            let flexible: boolean = false;
            let childName: string = "";
            let timer = "";
            let time = "";
            if (key === "startTime" && typeof value === "string") {
              const [hoursStr, minutesStr, secondsStr] = value.split(":");
              const hours = parseInt(hoursStr);
              const minutes = parseInt(minutesStr);
              const seconds = parseInt(secondsStr);

              startDate.setHours(hours);
              startDate.setMinutes(minutes);
              startDate.setSeconds(seconds);
            } else if (key === "endTime" && typeof value === "string") {
              const [hoursStr, minutesStr, secondsStr] = value.split(":");
              const hours = parseInt(hoursStr);
              const minutes = parseInt(minutesStr);
              const seconds = parseInt(secondsStr);

              endDate.setHours(hours);
              endDate.setMinutes(minutes);
              endDate.setSeconds(seconds);
            } else if (Array.isArray(value)) {
              daysRecurring = value.map(day => day);
            } else if (key === "title" && typeof value === "string") {
              title = value;
            } else if (key === "childName" && typeof value === "string") {
              childName = value;
            } else if (key === "timer" && typeof value === "string") {
              timer = value;
            } else if (key === "time" && typeof value === "string") {
              time = value;
            } else if (typeof value === "boolean") {
              if (key === "isRecurring") {
                isRecurring = value;
              } else if (key === "isCompleted") {
                isCompleted = value;
              } else if (key === "scheduled") {
                scheduled = value;
              } else if (key === "flexible") {
                flexible = value;
              }
            }

            const task: Task = {
              title,
              text: title,
              startDate,
              endDate,
              timer,
              time,
              daysRecurring,
              isRecurring,
              isCompleted,
              flexible,
              scheduled,
              childName
            };
            dispatch({ type: "ADD_TASK", payload: task });
          }
        } else {
          console.error(`${tasksResponse.status}: ${tasksResponse.statusText}`);
        }
      } catch (error) {
        console.error(`Failed to fetch tasks: ${error}`);
      }
    };

    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks: state.tasks,
      currentTask: state.currentTask,
      upcomingTask: state.upcomingTask,
      addTask,
      updateTask,
      deleteTask
    }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);