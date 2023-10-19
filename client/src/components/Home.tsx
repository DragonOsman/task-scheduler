import { UserContext } from "src/context/userContext";
import { ViewContext } from "src/context/viewContext";
import { useContext, useState } from "react";
import CurrentTask from "./CurrentTask";
import { Link } from "react-router-dom";
import ChildSchedule from "./ChildSchedule";
import { Modal, Button } from "react-bootstrap";

const Home = (): JSX.Element => {
  const { state } = useContext(UserContext);
  const viewContext = useContext(ViewContext);
  const viewState = viewContext.state;
  const [showModal, setShowModal] = useState(true);

  const handleModalToggle = () => setShowModal(!showModal);

  let data;
  if (state.currentUser) {

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
      data = (
        Array.isArray(children) ? (
          <>
            <Modal closeButton={handleModalToggle} show={showModal}>
              <Modal.Header>
                <Modal.Title>Add Tasks Now?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to add tasks for your children now or later?</p>
                <Button className="btn btn-primary">
                  Add Tasks
                </Button>
                <Button className="btn btn-secondary">
                  Later
                </Button>
              </Modal.Body>
            </Modal>
          </>
        ) : (firstChild && (
          <>
            <Modal closeButton={handleModalToggle} show={showModal}>
              <Modal.Header>
                <Modal.Title>Add {firstChild.firstName}&apos;s Tasks Now?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to add {firstChild.firstName}&apos;s tasks now or later?</p>
                <Link to="/add-task">
                  <Button>Add Task</Button>
                </Link>
                <Button onClick={handleModalToggle}>
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
          {state.currentUser && state.currentUser.role === "parent" && viewState.view === "parent" ? (
            <>
              {data && data}
              {state.currentUser.children && (
                state.currentUser.children.length === 1 ? (
                  <ChildSchedule child={state.currentUser.children[0]} />
                ) : (
                  <ul className="schedules">
                    {state.currentUser.children && state.currentUser.children.map(child => (
                      <li className="link" key={child.firstName}>
                        {state.currentUser && state.currentUser.children && (
                          <ChildSchedule child={child} />
                        )}
                      </li>
                    ))}
                  </ul>
                )
              )}
              <Link to="/tasks">Tasks Page</Link>
            </>
          ) : state.currentUser && state.currentUser.role === "parent" && viewState.view === "child" ? (
            <>
              {state.currentUser.children && state.currentUser.children.length > 1 ? (
                state.currentUser.children.map((child, index) => (
                  <>
                    <Link key={child.firstName} to={`${child.firstName?.toLocaleLowerCase()}-page`}>
                      {child.firstName && child.firstName}
                    </Link>
                    {child.isActive = true}
                    {state.currentUser && state.currentUser.children && (
                      index !== state.currentUser.children.length - 1 ? (
                        <br />
                      ) : null
                    )}
                  </>
                ))
              ) : (
                <CurrentTask />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;