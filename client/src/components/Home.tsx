import { UserContext } from "src/context/userContext";
import { useContext } from "react";
import CurrentTask from "./CurrentTask";
import ListTasks from "./ListTasks";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
          {state.currentUser && state.currentUser.role === "child" ? (
            <CurrentTask />
          ) : (
            <>
              <ListTasks />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;