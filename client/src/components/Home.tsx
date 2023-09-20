import { UserContext } from "src/context/userContext";
import { useContext, useEffect } from "react";
import CurrentTask from "./CurrentTask";
import ListTasks from "./ListTasks";
import ChildRegistrationModals from "./ChildRegistrationModals";
import { Modal, Button } from "react-bootstrap";
import { useTaskContext } from "../context/taskContext";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const { addTask } = useTaskContext();

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
          console.log("in Home, data.user is:");
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

    if (state.currentUser.role === "parent" &&
    state.currentUser.dateRegistered === new Date()) {
      let firstChild;
      let children;
      if (state.currentUser.children) {
        if (state.currentUser.children.length === 1) {
          firstChild = state.currentUser.children[0];
        } else if (state.currentUser.children.length > 1) {
          children = state.currentUser.children;
        }
      }
      return (
        Array.isArray(children) ? (
          <>
            <ChildRegistrationModals />
            <Modal closeButton>
              <Modal.Header>
                <Modal.Title>Add Tasks Now?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to add tasks for your children now or later?</p>
                <Button>
                  Add Tasks
                </Button>
                <Button>
                  Later
                </Button>
              </Modal.Body>
            </Modal>
          </>
        ) : (firstChild && (
          <>
            <ChildRegistrationModals />
            <Modal closeButton>
              <Modal.Header>
                <Modal.Title>Add {firstChild.firstName}&apos;s Tasks Now?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to add {firstChild.firstName}&apos;s tasks now or later?</p>
                <Button>
                  Add Tasks
                </Button>
                <Button>
                  Later
                </Button>
              </Modal.Body>
            </Modal>
          </>
        )));
    }
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