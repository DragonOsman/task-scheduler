import React, { useState } from "react";
import { SchedulerDateTime } from "@devexpress/dx-react-scheduler";

interface ITask {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date
}

const AddTask = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const addTask = (task: ITask) => {
    setTasks([...tasks, task]);
  };

  return (
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const titleInput = form.elements.namedItem("taskTitle") as HTMLInputElement;
      const startDateInput = form.lements.namedItem("taskStartDate") as HTMLInputElement;
      const endDateInput = form.elements.namedItem("taskEndDate") as HTMLInputElement;
      const taskTitle = titleInput.value;
      const taskStardDate: SchedulerDateTime = new Date(startDateInput.value);
      const taskEndDate: SchedulerDateTime = new Date(endDateInput.value);
      addTask({
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0,
        title: taskTitle,
        startDate: taskStardDate,
        endDate: taskEndDate
      });
    }}>
      <input name="taskTitle" type="text" placeholder="Task Title" title="task title" required />
      <input name="taskStartDate" type="datetime-local" title="task starting date and time" required />
      <input name="taskEndDate" type="datetime-local" title="task ending date and time" required />
      <button type="submit" title="add task">Add Task</button>
    </form>
  );
};

export default AddTask;