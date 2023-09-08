import { useTaskContext } from "../context/taskContext";
import { useState, useEffect } from "react";

interface PetProps {
  isInGreeting: boolean;
};

const Pet = ({ isInGreeting }: PetProps) => {
  const [{ currentTask, upcomingTask, tasks }] = useTaskContext();
  const [petMood, setPetMood] = useState("");
  const [numberCompleted, setNumberCompleted] = useState(0);

  useEffect(() => {
    if (isInGreeting) {
      setPetMood("happy");
    } else {
      if (currentTask && new Date().getTime() < currentTask.endTime.getTime()) {
        setPetMood("happy");
      } else if (currentTask && new Date().getTime() > currentTask.endTime.getTime()) {
        setPetMood("sad");
      } else if (currentTask && new Date().getTime() === currentTask.endTime.getTime()) {
        setPetMood("neutral");
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

      if (!currentTask && !upcomingTask) {
        setPetMood("happy");
      }
    }
  }, [currentTask, numberCompleted, tasks]);

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
        The pet's mood is <span className={`${
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