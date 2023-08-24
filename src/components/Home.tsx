import ListTasks from "./ListTasks";
import { useTaskContext } from "../context/taskContext";
import { MouseEvent } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [state, dispatch] = useTaskContext();

  const toggleChild = (event: MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "TOGGLE_CHILD", payload: {
      currentTask: state.currentTask,
      currentChild: event.currentTarget.value,
      tasks: state.tasks
    } });
    event.currentTarget.classList.add("active");
  };

  return (
    <div className="Home container-fluid">
      Toggle Current Child to:
      <button
        type="button"
        title="toggle current child to Amira"
        value="Amira"
        onClick={toggleChild}
        className="btn btn-primary active"
      >
        Amira
      </button>
      <button
        type="button"
        title="toggle current child to Noora"
        value="Noora"
        onClick={toggleChild}
        className="btn btn-primary"
      >
        Noora
      </button>
      <ListTasks />
      <Link to="/current-task" className="current-task-link btn btn-primary">
        Current Task Page
      </Link>
    </div>
  );
};

export default Home;