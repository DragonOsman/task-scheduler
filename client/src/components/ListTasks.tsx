import { useTaskContext } from "src/context/taskContext";
import { UserContext } from "src/context/userContext";
import { useState, useContext } from "react";

const ListTasks = () => {
  const { tasks, updateTask, deleteTask } = useTaskContext();
  const [isCompleted, setIsCompleted] = useState(false);
  const { state } = useContext(UserContext);

  const list = (
    <ul>
      {tasks.map(task => (
        <li className="task" key={task._id}>
          <button
            type="button"
            title="mark task as completed"
            className="btn btn-success"
            onClick={() => {
              setIsCompleted(!isCompleted);
              updateTask(task._id, {
                ...task,
                isCompleted
              });
            }}
          >
            Done
          </button>
          {task.title}
          <button
            type="button"
            title="delete task"
            className="btn btn-danger"
            onClick={() => {
              deleteTask(task._id, task);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container-fluid">
      <h3>{state.currentUser?.firstName}&apos;s Chores</h3>
      <div className="list">
        {list}
      </div>
    </div>
  );
};

export default ListTasks;