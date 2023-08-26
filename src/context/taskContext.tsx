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

const tasks = data["Amira"]["Chores"];

export interface ITask {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  isCompleted: boolean;
  daysRecurring: string[];
  scheduled?: boolean;
  flexible?: boolean;
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
    currentTask?: ITask
  }
}

const initialState: State = {
  tasks: [],
  currentTask: {
    id: 0,
    title: "",
    startTime: new Date(),
    endTime: new Date(),
    isRecurring: false,
    isCompleted: false,
    daysRecurring: [],
    scheduled: false,
    flexible: false
  },
  task: {
    id: 0,
    title: "",
    startTime: new Date(),
    endTime: new Date(),
    isRecurring: false,
    isCompleted: false,
    daysRecurring: [],
    scheduled: false,
    flexible: false
  }
};

const tasksReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TASK":
      return { tasks: action.payload.tasks,
        task: action.payload?.task
      };
    case "EDIT_TASK":
      return {
        task: action.payload?.task,
        tasks: action.payload.tasks.map(task => task.id === action.payload.task?.id ?
          action.payload.task : task)
      };
    case "DELETE_TASK":
      return {
        tasks: action.payload.tasks.filter(task => task.id !== action.payload.task?.id)
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

  // select current task
  useEffect(() => {
    dispatch({ type: "SELECT_CURRENT_TASK", payload: {
      tasks: state.tasks,
      currentTask: state.tasks.find(task => !task.isCompleted &&
        new Date(task.endTime) > new Date())
    } });
  }, [state.tasks]);

  // fill tasks array
  useEffect(() => {
    dispatch({ type: "ADD_TASK", payload: {
      tasks: tasks.map(task => {
        const startTimeStr = task.startTime;
        const startTimeArr = startTimeStr.split(":");
        const startTime = new Date();
        startTime.setHours(Number(startTimeArr[0]));
        startTime.setMinutes(Number(startTimeArr[1]));
        startTime.setSeconds(Number(startTimeArr[2]));
        const endTimeStr = task.endTime;
        const endTimeArr = endTimeStr.split(":");
        const endTime = new Date();
        endTime.setHours(Number(endTimeArr[0]));
        endTime.setMinutes(Number(endTimeArr[1]));
        endTime.setSeconds(Number(endTimeArr[2]));

        return { ...task, startTime, endTime };
      })
    } });
  }, []);

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