import {
  useReducer,
  createContext,
  useContext,
  Dispatch,
  ReactNode,
  Reducer,
  useEffect
} from "react";
import data from "../data.json";

const amiraTasks = data["Amira"]["Chores"];
const nooraTasks = data["Noora"]["Chores"];

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
  child: "Amira",
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
      return { tasks: action.payload.tasks,
        task: action.payload?.task, child: action.payload?.child
      };
    case "EDIT_TASK":
      return {
        task: action.payload?.task,
        tasks: action.payload.tasks.map(task => task.id === action.payload.task?.id ?
          action.payload.task : task),
        child: action.payload?.child
      };
    case "DELETE_TASK":
      return {
        tasks: action.payload.tasks.filter(task => task.id !== action.payload.task?.id),
        child: action.payload?.child
      };
    case "TOGGLE_CHILD":
      return {
        tasks: action.payload.tasks,
        child: action.payload.child
      };
    default:
      return state;
  }
};

const TaskContext = createContext<[State, Dispatch<Action>] | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
};

const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(tasksReducer, initialState);

  useEffect(() => {
    if (state.child === "Amira") {
      dispatch({ type: "ADD_TASK", payload: {
        tasks: amiraTasks.map((task): ITask => ({
          ...task, startTime: new Date(task.startTime), endTime: new Date(task.endTime)
        }))
      } });
    } else if (state.child === "Noora") {
      dispatch({ type: "ADD_TASK", payload: {
        tasks: nooraTasks.map((task): ITask => ({
          ...task, startTime: new Date(task.startTime), endTime: new Date(task.endTime)
        }))
      } });
    }
  }, [state.child]);

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