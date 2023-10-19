import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "src/context/userContext";
import { ViewContext } from "src/context/viewContext";
import { Container, Nav, Navbar, NavbarBrand, Modal } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import Login from "./Login";

const Header = () => {
  const { state, dispatch } = useContext(UserContext);
  const viewContext = useContext(ViewContext);
  const viewState = viewContext.state;
  const viewDispatch = viewContext.dispatch;
  const [buttonClicked, setButtonClicked] = useState<HTMLButtonElement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://dragonosman-task-scheduler.onrender.com/api/users/logout", {
          method: "GET",
          credentials: "include"
        })
      ;

      if (response.ok) {
        dispatch({ type: "SET_CURRENT_USER", payload: null });
        navigate("/login");
      } else {
        console.error(`${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Error logging you out: ${err}`);
    }
  };

  return (
    <header className="container-fluid">
      <Navbar className="bg-body-tertiary" expand="lg" fixed="top">
        <Container className="container-fluid row">
          <NavbarBrand className="col-auto">
            {state.currentUser ? (
              <Link to="/">
                <img src={logo} alt="dragon-logo" className="dragon-logo" />
              </Link>
            ) : (
              <img src={logo} alt="dragon-logo" className="dragon-logo" />
            )}
          </NavbarBrand>
          <Navbar.Toggle aria-controls="navbar-content" className="col-auto navbar-toggle" />
          <NavbarCollapse id="navbar-content">
            <Nav className="me-auto mb-2 navbar-lg-0">
              {(state.currentUser && viewState.view === "parent") ? (
                <ul className="navbar-nav col">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  {state.currentUser && state.currentUser.role === "parent" ? (
                    <li className="nav-item">
                      <Link to="/add-child" className="nav-link">Add a Child</Link>
                    </li>
                  ) : null}
                  <li className="nav-item">
                    <button
                      type="button"
                      title="parent view"
                      onClick={() => viewDispatch({
                        type: "CHANGE_VIEW",
                        payload: "parent"
                      })}
                      className="btn btn-primary"
                    >
                      Parent View
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      title="child view"
                      onClick={() => viewDispatch({
                        type: "CHANGE_VIEW",
                        payload: "child"
                      })}
                      className="btn btn-primary"
                    >
                      Child View
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-danger"
                      title="logout"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (state.currentUser && viewState.view === "child") ? (
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <button
                      type="button"
                      title="parent view"
                      onClick={(event) => {
                        setButtonClicked(event.currentTarget);
                        setShowModal(true);
                      }}
                      className="btn btn-primary"
                    >
                      Parent View
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      title="child view"
                      onClick={event => {
                        viewDispatch({
                          type: "CHANGE_VIEW",
                          payload: "child"
                        });
                        setButtonClicked(event.currentTarget);
                      }}
                      className="btn btn-primary"
                    >
                      Child View
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-danger"
                      title="logout"
                      disabled
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </ul>
              )}{buttonClicked && buttonClicked.textContent === "Parent View" && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <h2>Login Again</h2>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Login />
                  </Modal.Body>
                </Modal>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;