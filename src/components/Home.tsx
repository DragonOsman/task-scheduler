import ListTasks from "./ListTasks";
import { useTaskContext } from "../context/taskContext";
import { MouseEvent } from "react";

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
    <div className="container-fluid">
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
    </div>
  );
};

export default Home;