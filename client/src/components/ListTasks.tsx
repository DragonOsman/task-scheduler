import { useTaskContext, ITask } from "src/context/taskContext";
import { useState } from "react";
import EditTask from "./EditTask";

const ListTasks = () => {
  const [{ tasks }, dispatch] = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const taskListElems = tasks.map(task => {
    return (
      <li
        key={task.id}
        className={`task ${task.isCompleted ? "completed" : ""}`}
      >
        <button
          type="button"
          title="mark as completed"
          className="btn btn-success"
          onClick={(event) => {
            event.preventDefault();
            setIsCompleted(!isCompleted);
            dispatch({
              type: "EDIT_TASK",
              payload: {
                task: {
                  ...task,
                  isCompleted
                },
                tasks
              }
            });
          }}
        >
          Done
        </button>
        {task.title}
        {" "}
        {task.startTime.toTimeString()}-{task.endTime.toTimeString()}
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
        <h3>Amira's Chores</h3>
        <ul className="list">
          {taskListElems}
        </ul>
      </div>

      {selectedTask && (
        <EditTask task={selectedTask} />
      )}
    </div>
  );
};

export default ListTasks;