/* eslint-disable linebreak-style */
import { createContext, useReducer, useContext, useEffect, ReactNode } from "react";

export interface Task {
  _id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  timer?: string;
  time?: string;
  scheduled?: boolean;
  flexible?: boolean;
  isRecurring: boolean;
  daysRecurring?: string[];
  isCompleted: boolean;
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
    timer: "",
    time: "",
    startTime: new Date,
    endTime: new Date,
    isCompleted: false,
    isRecurring: false,
    daysRecurring: []
  },
  upcomingTask: {
    _id: "",
    title: "",
    timer: "",
    time: "",
    startTime: new Date,
    endTime: new Date,
    isCompleted: false,
    isRecurring: false,
    daysRecurring: []
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
    try {
      const taskResponse = await fetch("http://localhost:3000/api/tasks/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(task),
        mode: "cors"
      });

      if (taskResponse.status >= 200 && taskResponse.status < 300) {
        const data = await taskResponse.json();
        dispatch({ type: "ADD_TASK", payload: data.task });
      } else {
        console.error(`${taskResponse.status}: ${taskResponse.statusText}`);
      }
    } catch (error) {
      console.error(`Error adding task: ${error}`);
    }
  };

  const updateTask = async (taskId: string, task: Task) => {
    try {
      const taskResponse = await fetch(`http://localhost:3000/api/edit-task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(task),
        mode: "cors"
      });

      if (taskResponse.status >= 200 && taskResponse.status < 300) {
        const data = await taskResponse.json();
        dispatch({ type: "UPDATE_TASK", payload: { taskId, task: data.task } });
      } else {
        console.error(`${taskResponse.status}: ${taskResponse.statusText}`);
      }
    } catch (error) {
      console.error(`Error editing task ${error}`);
    }
  };

  const deleteTask = async (taskId: string, task: Task) => {
    try {
      const taskResponse = await fetch(`http://localhost:3000/api/tasks/delete-task/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task),
        mode: "cors"
      });

      if (taskResponse.status >= 200 && taskResponse.status < 300) {
        const data = await taskResponse.json();
        dispatch({ type: "DELETE_TASK", payload: { taskId, task: data.task } });
      } else {
        console.error(`${taskResponse.status}: ${taskResponse.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting task: ${error}`);
    }
  };

  useEffect(() => {
    const currentTask = state.tasks.find(task => !task.isCompleted);
    if (currentTask) {
      dispatch({
        type: "SELECT_CURRENT_TASK",
        payload: {
          currentTask
        }
      });
    }
  }, [state.tasks]);

  useEffect(() => {
    const upcomingTask = state.tasks.find(task => {
      return !task.isCompleted && new Date().getTime() < task.startTime.getTime();
    });
    if (upcomingTask) {
      dispatch({
        type: "SELECT_UPCOMING_TASK",
        payload: {
          upcomingTask
        }
      });
    }
  }, [state.tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await fetch("http://localhost:3000/api/tasks/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          mode: "cors"
        });

        if (tasksResponse.status >= 200 && tasksResponse.status < 300) {
          const data = await tasksResponse.json();
          for (const task of data.tasks) {
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