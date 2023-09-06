import Pet from "./Pet";
import { Link } from "react-router-dom";

const Greeting = () => {
  return (
    <div className="greeting-screen">
      <Pet />
      <h1>Good morning</h1>
      <Link to="/current-task" className="btn btn-primary">Go to first task</Link>
    </div>
  )
};

export default Greeting;