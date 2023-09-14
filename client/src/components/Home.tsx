import { UserContext } from "src/context/userContext";
import { useContext, useEffect } from "react";
import CurrentTask from "./CurrentTask";
import ListTasks from "./ListTasks";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const detailsResponse = await fetch("http://localhost:3000/api/users/user-details", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          mode: "cors"
        });

        if (detailsResponse.ok) {
          const data = await detailsResponse.json();
          console.log("in userContext, data.user is:");
          for (const [key, value] of Object.entries(data.user)) {
            console.log(`${key}: ${value}`);
          }
          dispatch({
            type: "SET_CURRENT_USER",
            payload: data.user
          });
        } else {
          console.error(`${detailsResponse.status}: ${detailsResponse.statusText}`);
        }
      } catch (error) {
        console.error(`Something went wrong: ${error}`);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  if (state.currentUser) {
    console.log(state.currentUser.role);
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="col-auto">
          {state.currentUser && state.currentUser.role === "child" ? (
            <CurrentTask />
          ) : state.currentUser && state.currentUser.role === "parent" ? (
            <>
              <ListTasks />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;