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
  currentChild?: string;
  task?: ITask,
  currentTask?: ITask;
};

interface Action {
  type: string;
  payload: {
    tasks: ITask[];
    task?: ITask;
    currentChild?: string;
    currentTask?: ITask
  }
}

const initialState: State = {
  tasks: [],
  currentChild: "Amira",
  currentTask: {
    id: 0,
    title: "",
    startTime: new Date(),
    endTime: new Date(),
    isRecurring: false,
    isCompleted: false,
    daysRecurring: []
  },
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
        task: action.payload?.task, currentChild: action.payload?.currentChild
      };
    case "EDIT_TASK":
      return {
        task: action.payload?.task,
        tasks: action.payload.tasks.map(task => task.id === action.payload.task?.id ?
          action.payload.task : task),
        currentChild: action.payload?.currentChild
      };
    case "DELETE_TASK":
      return {
        tasks: action.payload.tasks.filter(task => task.id !== action.payload.task?.id),
        currentChild: action.payload?.currentChild
      };
    case "TOGGLE_CHILD":
      return {
        tasks: action.payload.tasks,
        currentChild: action.payload.currentChild
      };
    case "SELECT_CURRENT_TASK":
      return {
        tasks: action.payload.tasks,
        currentTask: action.payload.currentTask
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
    dispatch({ type: "ADD_TASK", payload: {
      tasks: state.currentChild === "Amira" ?
        amiraTasks.map((task): ITask => ({
        ...task, startTime: new Date(task.startTime), endTime: new Date(task.endTime)
      })) : nooraTasks.map((task): ITask => ({
        ...task, startTime: new Date(task.startTime), endTime: new Date(task.endTime)
      }))
    } });
  }, [state.currentChild]);

  useEffect(() => {
    dispatch({ type: "SELECT_CURRENT_TASK", payload: {
      tasks: state.tasks,
      currentTask: state.tasks.find(task => !task.isCompleted)
    } });
  }, [state.tasks]);

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