import ListTasks from "./ListTasks";
import { useTask, ITask } from "../context/taskContext";
import { useState } from "react";
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

const Home = () => {
  const [currentChild, setCurrentChild] = useState("Amira");
  const [state, dispatch] = useTask();

  const toggleCurrentChild = (child: string) => setCurrentChild(child);

  const fillTasks = () => {
    dispatch({ type: "ADD_TASK", tasks: currentChild === "Amira" ?
      convertToValidTasks(amiraTasks).map(task => task) :
      convertToValidTasks(nooraTasks).map(task => task) });
  };

  return (
    <div className="container-fluid">
      <button
        type="button"
        className="btn btn-primary"
        title="toggle child"
        onClick={() => {
          currentChild === "Amira" ? toggleCurrentChild("Noora") :
            toggleCurrentChild("Amira")
          ;
        }}
      >
        Toggle Child
      </button>
      <button
        type="button"
        className="btn btn-primary"
        title="fill tasks list"
        onClick={() => {
          fillTasks();
        }}
      >
        Initialize Tasks
      </button>
      <ListTasks />
    </div>
  );
};

export default Home;