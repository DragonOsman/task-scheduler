import "./App.css";
import { useState, useEffect } from "react";
import { useTask, ITask } from "./context/TaskContext";
import Home from "./components/Home";
import ListTasks from "./components/ListTasks";
import { Routes, Route } from "react-router-dom";
import data from "./data.json";

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

function App() {
  const [currentChild, setCurrentChild] = useState("Amira");
  const [state, dispatch] = useTask();

  const toggleCurrentChild = (child: string) => setCurrentChild(child);

  useEffect(() => {
    if (currentChild === "Amira") {
      toggleCurrentChild("Noora");
    } else if (currentChild === "Noora") {
      toggleCurrentChild("Amira");
    }
  }, [currentChild]);

  const fillTasks = () => {
    dispatch({ type: "ADD_TASK", payload: {
      ...state,
      tasks: currentChild === "Amira" ? convertToValidTasks(amiraTasks).map(task => task) :
        convertToValidTasks(nooraTasks).map(task => task)
    } });
  };
  fillTasks();

  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<ListTasks />} path="/list-tasks" />
    </Routes>
  );
}

export default App;
