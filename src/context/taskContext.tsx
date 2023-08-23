import { useReducer, createContext, useContext, Dispatch, ReactNode, Reducer } from "react";
import data from "../data.json";

const amiraTasks = data["Amira"]["Chores"];
const nooraTasks = data["Noora"]["Chores"];

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
        isCompleted: false,
        daysRecurring: []
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

      if (innerKey === "daysRecurring" && Array.isArray(innerValue)
        && innerValue.length > 0) {
        task.daysRecurring = [...innerValue];
      }

      task.id = newData.length > 0 ?
        newData[newData.length - 1].id + 1 : 0
      ;

      if (innerKey === "isRecurring" && typeof innerValue === "boolean") {
        task.isRecurring = innerValue;
      }
      console.log("Inside Home.tsx, convertToValidTasks function:");
      console.log("task:");
      console.log(`Title: ${task.title}`);
      console.log(`startTime: ${task.startTime}`);
      console.log(`endTime: ${task.endTime}`);
      console.log(`isCompleted: ${task.isCompleted}`);
      console.log(`isRecurring: ${task.isRecurring}`);
      console.log("daysRecurring:");
      task.daysRecurring.length > 0 &&
        task.daysRecurring.forEach(dayRecurring => console.log(dayRecurring));
      newData.push(task);
    }
  }
  return newData;
};

export interface ITask {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  isCompleted: boolean;
  daysRecurring: string[]
};

interface State {
  tasks: ITask[];
  child?: string;
  task?: ITask
};

interface Action {
  type: string;
  payload: {
    tasks: ITask[];
    task?: ITask;
    child?: string;
  }
}

const initialState: State = {
  tasks: [],
  child: "",
  task: {
    id: 0,
    title: "",
    startTime: new Date(),
    endTime: new Date(),
    isRecurring: false,
    isCompleted: false,
    daysRecurring: []
  }
};

const tasksReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TASK":
      return { tasks: action.payload.tasks.map(task => task),
        task: action.payload.task, child: action.payload.child };
    case "EDIT_TASK":
      return { task: action.payload.task,
        tasks: action.payload.tasks, child: action.payload.child };
    case "DELETE_TASK":
      return { tasks: state.tasks.filter((task, index) => (
        task.id !== action.payload.tasks[index].id)),
          child: action.payload.child, task: action.payload.task };
    case "TOGGLE_CHILD":
      return { tasks: action.payload.tasks,
        child: action.payload.child, task: action.payload.task };
    default:
      return state;
  }
};

const TaskContext = createContext<[State, Dispatch<Action>] | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
};

const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  return (
    <TaskContext.Provider value={[state, dispatch]}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const taskContext = useContext(TaskContext);
  if (taskContext === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return taskContext;
};

export default TaskProvider;