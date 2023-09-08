import { useTaskContext, ITask } from "src/context/taskContext";
import { useState } from "react";
import EditTask from "./EditTask";
import TaskDetails from "./TaskDetails";
import { Link } from "react-router-dom";

const ListTasks = () => {
  const [{ tasks }, dispatch] = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const taskListElems = tasks.map(task => {
    return (
      <li
        key={task.id}
        className={`task ${task.isCompleted ? "completed" : ""}`}
      >
        <span onClick={() => {
          setSelectedTask(task);
          setShowTaskDetails(true);
          }}>{task.title}</span>
        {" "}
        {task.scheduled ? (
          `${task.startTime.toTimeString()}-${task.endTime.toTimeString()}`) :
            task.flexible ?
            `${(task.endTime.getTime() / 1000 / 60) - (task.startTime.getTime() / 1000 / 60)}mins` : ""}
        {" "}
        <button
          type="button"
          title="delete task"
          className="btn btn-danger"
          onClick={() => {
            dispatch({ type: "DELETE_TASK", payload: {
              task,
              tasks
            } });
          }}
        >
          Delete
        </button>
        <button
          type="button"
          title="edit task"
          onClick={() => {
            setSelectedTask(task);
          }}
          className="btn btn-warning"
        >
          Edit
        </button>
      </li>
    );
  });

  return (
    <div className="task-list">
      <div className="container container-fluid">
        <h3>Amira's Schedule</h3>
        <ul className="list">
          {taskListElems}
        </ul>
      </div>

      {(selectedTask && !showTaskDetails) && (
        <EditTask task={selectedTask} />
      )}
      {(selectedTask && showTaskDetails) && (
        <TaskDetails task={selectedTask} />
      )}
    </div>
  );
};

export default ListTasks;