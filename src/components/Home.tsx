import ListTasks from "./ListTasks";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="Home container-fluid">
      <ListTasks />
      <Link to="/current-task" className="current-task-link btn btn-primary">
        Current Task Page
      </Link>
    </div>
  );
};

export default Home;