import { useTaskContext } from "../context/taskContext";
import { useState, useEffect } from "react";

const Pet = () => {
  const [{ currentTask }] = useTaskContext();
  const [petMood, setPetMood] = useState("");

  useEffect(() => {
    if (currentTask && new Date().getTime() < currentTask.endTime.getTime()) {
      setPetMood("happy");
    } else if (currentTask && new Date().getTime() >= currentTask.endTime.getTime()) {
      setPetMood("sad");
    }
  }, [currentTask]);

  return (
    <div className="pet">
      <p className="pet-mood">
        The pet is very <span className={`${
          petMood === "happy" ?
            "text-success" :
            "text-danger"}`
          }
          >
            {petMood}
          </span>
      </p>
    </div>
  );
};

export default Pet;