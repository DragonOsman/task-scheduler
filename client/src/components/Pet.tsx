import { useTaskContext } from "../context/taskContext";
import { useState, useEffect } from "react";

const Pet = () => {
  const [{ currentTask, tasks }] = useTaskContext();
  const [petMood, setPetMood] = useState("");
  const [numberCompleted, setNumberCompleted] = useState(0);

  useEffect(() => {
    if (currentTask && new Date().getTime() < currentTask.endTime.getTime()) {
      setPetMood("happy");
    } else if (currentTask && new Date().getTime() >= currentTask.endTime.getTime()) {
      setPetMood("sad");
    }

    if (currentTask && tasks.indexOf(currentTask) !== 0 && numberCompleted === tasks.length) {
      setPetMood("happy");
    } else if (currentTask && tasks.indexOf(currentTask) !== 0 &&
      numberCompleted === (tasks.length / 2)) {
      setPetMood("neutral");
    } else if (currentTask && tasks.indexOf(currentTask) !== 0 &&
      (numberCompleted < tasks.length || numberCompleted === 0)) {
      setPetMood("sad");
    } else if (currentTask && tasks.indexOf(currentTask) && numberCompleted < (tasks.length / 2)) {
      setPetMood("sad");
    }
  }, [currentTask]);

  useEffect(() => {
    for (const task of tasks) {
      if (task.isCompleted) {
        setNumberCompleted(score => score++);
      }
    }
  }, [tasks]);

  return (
    <div className="pet">
      <p className="pet-mood">
        The pet is <span className={`${
          petMood === "happy" ?
            "text-success" :
            petMood === "sad" ?
            "text-danger" :
            petMood === "neutral" ?
            "text-warning" : ""}`
          }
          >
            {petMood}
          </span>
      </p>
    </div>
  );
};

export default Pet;