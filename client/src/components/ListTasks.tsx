import { useTaskContext } from "src/context/taskContext";
import { UserContext } from "src/context/userContext";
import { useState, useContext } from "react";
//import { Link } from "react-router-dom";

const ListTasks = () => {
  const { tasks, updateTask, deleteTask } = useTaskContext();
  const [isCompleted, setIsCompleted] = useState(false);
  const { state } = useContext(UserContext);

  let list: JSX.Element | null = null;
  if (state.currentUser && state.currentUser.children) {
    if (state.currentUser.children.length > 0) {
      list = (
        <ul>
          {state.currentUser.children.map(child => (
            <li className="child-info" key={child._id}>
              {child.firstName}
              {tasks.length > 0 ? (
                <ul className="tasks">{tasks.map(task => (
                  <li className="task" key={task._id}>
                    <button
                      type="button"
                      title="mark task as completed"
                      onClick={() => {
                        setIsCompleted(!isCompleted);
                        updateTask(task._id, {
                          ...task,
                          isCompleted
                        });
                      }}
                      className="btn btn-primary"
                    >
                      Complete
                    </button>
                    {task.title}
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteTask(task._id, task)}
                      title="delete task"
                    >
                      Delete
                    </button>
                  </li>
                ))}</ul>
              ) : <p>This child has no tasks to show at the moment</p>}
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <div className="container-fluid">
      {list ? (
        <>
          <h3>Your children and their tasks</h3>
          {list}
        </>
      ) : (
        <p>No children registered to show data for</p>
      )}
    </div>
  );
};

export default ListTasks;