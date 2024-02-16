import { ViewContext } from "src/context/viewContext";
import { useContext, useState } from "react";
import CurrentTask from "./CurrentTask";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Home = (): JSX.Element => {
  const viewContext = useContext(ViewContext);
  const viewState = viewContext.state;
  const [showModal, setShowModal] = useState(true);

  const handleModalToggle = () => setShowModal(!showModal);

  let data;
  if (viewState.view === "parent") {
    data = (
      <Modal closeButton={handleModalToggle} show={showModal}>
        <Modal.Header>
          <Modal.Title>Add Amira&apos;s Tasks Now?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Would you like to add Amira&apos;s tasks now or later?</p>
          <Link to="/add-task">
            <Button>Add Task</Button>
          </Link>
          <Button onClick={handleModalToggle}>
            Later
          </Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="col-auto">
          {viewState.view === "parent" ? (
            <>
              {data && data}
              <Link to="/tasks">Tasks Page</Link>
            </>
          ) : viewState.view === "child" &&
            <CurrentTask />}
        </div>
      </div>
    </div>
  );
};

export default Home;