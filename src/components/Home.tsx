import ListTasks from "./ListTasks";
import { useTaskContext } from "../context/taskContext";
import { MouseEvent } from "react";

const Home = () => {
  const [state, dispatch] = useTaskContext();

  const toggleChild = (event: MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "TOGGLE_CHILD", payload: {
      child: event.currentTarget.value,
      tasks: state.tasks
    } });
  };

  return (
    <div className="container-fluid">
      Toggle Current Child to:
      <button
        type="button"
        title="toggle current child to Amira"
        value="Amira"
        onClick={toggleChild}
        className="btn btn-primary"
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