import { createContext, useEffect, useReducer, ReactNode, Dispatch } from "react";
import { Task, useTaskContext } from "./taskContext";
import users from "../user-data.json";

export interface Child {
  firstName: string;
  wakeTime: Date;
  lunchTime: Date;
  dinnerTime: Date;
  sleepTime: Date;
  role: string;
  tasks: Task[];
}

export interface User {
  firstName: string;
  lastName: string;
  role: string;
  children: Child[];
}

interface UserAction {
  type: string;
  payload: {
    currentUser: User
  };
}

interface UserState {
  currentUser: User;
}

const initialState: UserState = {
  currentUser: {
    firstName: "",
    lastName: "",
    role: "parent",
    children: []
  }
};

export const UserContext = createContext<{
  state: UserState,
  dispatch: Dispatch<UserAction>
}>({
  state: initialState,
  dispatch: () => {}
});

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
  case "EDIT_USER":
    return {
      ...state,
      currentUser: {
        ...action.payload.currentUser
      }
    };
  case "SET_CURRENT_USER":
    return {
      ...state,
      currentUser: {
        ...action.payload.currentUser
      }
    };
  default: return state;
  }
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { tasks } = useTaskContext();

  useEffect(() => {
    const wakeTimeDate = new Date();
    const lunchTimeDate = new Date();
    const dinnerTimeDate = new Date();
    const sleepTimeDate = new Date();

    const childrenArr = users.users[0].children;
    const firstName = childrenArr[0].firstName;
    const wakeTime = childrenArr[0].wakeTime;
    const sleepTime = childrenArr[0].sleepTime;
    const lunchTime = childrenArr[0].lunchTime;
    const dinnerTime = childrenArr[0].dinnerTime;
    const role = childrenArr[0].role;

    const [wakeHrsStr, wakeMinsStr, wakeSecsStr] = wakeTime.split(":");
    const [sleepHrsStr, sleepMinsStr, sleepSecsStr] = sleepTime.split(":");
    const [lunchHrsStr, lunchMinsStr, lunchSecsStr] = lunchTime.split(":");
    const [dinnerHrsStr, dinnerMinsStr, dinnerSecsStr] = dinnerTime.split(":");

    const wakeHrs = parseInt(wakeHrsStr);
    const wakeMins = parseInt(wakeMinsStr);
    const wakeSecs = parseInt(wakeSecsStr);
    const sleepHrs = parseInt(sleepHrsStr);
    const sleepMins = parseInt(sleepMinsStr);
    const sleepSecs = parseInt(sleepSecsStr);
    const lunchHrs = parseInt(lunchHrsStr);
    const lunchMins = parseInt(lunchMinsStr);
    const lunchSecs = parseInt(lunchSecsStr);
    const dinnerHrs = parseInt(dinnerHrsStr);
    const dinnerMins = parseInt(dinnerMinsStr);
    const dinnerSecs = parseInt(dinnerSecsStr);

    wakeTimeDate.setHours(wakeHrs, wakeMins, wakeSecs);
    sleepTimeDate.setHours(sleepHrs, sleepMins, sleepSecs);
    lunchTimeDate.setHours(lunchHrs, lunchMins, lunchSecs);
    dinnerTimeDate.setHours(dinnerHrs, dinnerMins, dinnerSecs);

    const currentUser: User = {
      firstName: users.users[0].firstName,
      lastName: users.users[0].lastName,
      role: users.users[0].role,
      children: [{
        firstName,
        wakeTime: wakeTimeDate,
        lunchTime: lunchTimeDate,
        dinnerTime: dinnerTimeDate,
        sleepTime: sleepTimeDate,
        role,
        tasks
      }]
    };

    dispatch({ type: "SET_CURRENT_USER", payload: { currentUser } });
  }, [state, tasks]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};