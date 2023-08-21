import { useReducer, createContext, useContext, Dispatch, ReactNode, Reducer } from "react";

export interface ITask {
  id: number;
  title: string;
  startTime: Date;
  endTime?: Date;
  isRecurring: boolean;
  isCompleted: boolean;
  daysRecurring?: string[]
};

interface State {
  tasks: ITask[];
};

interface Action {
  type: string;
  payload: {
    tasks: ITask[]
  };
};

const initialState: State = {
  tasks: []
};

const tasksReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TASK":
      return { tasks: action.payload.tasks };
    case "EDIT_TASK":
      return { tasks: action.payload.tasks };
    case "DELETE_TASK":
      return { tasks: state.tasks.filter((task, index) => (
        task.id !== action.payload.tasks[index].id)) };
    default:
      throw new Error("Unknown type value");
  }
};

const TaskContext = createContext<[State, Dispatch<Action>] | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
};

const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(tasksReducer, initialState);

  return (
    <TaskContext.Provider value={[state, dispatch]}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const taskContext = useContext(TaskContext);
  if (taskContext === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return taskContext;
};

export default TaskProvider;