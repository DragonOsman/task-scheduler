import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "src/context/userContext";
import { ViewContext } from "src/context/viewContext";
import { Container, Nav, Navbar, NavbarBrand, Modal } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

const Header = () => {
  const { state, dispatch } = useContext(UserContext);
  const viewContext = useContext(ViewContext);
  const viewState = viewContext.state;
  const viewDispatch = viewContext.dispatch;
  const [buttonClicked, setButtonClicked] = useState<HTMLButtonElement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://dragonosman-task-scheduler.onrender.com/api/users/logout", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
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
              ) : (!state.currentUser && viewState.view === "child") ? (
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
                      <h1>Re-Enter Login Credentials</h1>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={event => {
                      event.preventDefault();
                      if (state.currentUser && username === state.currentUser.username &&
                        password === state.currentUser.password) {
                        viewDispatch({
                          type: "CHANGE_VIEW",
                          payload: "parent"
                        });
                      }
                    }} className="container-fluid" method="post">
                      <fieldset className="mb-3">
                        <legend>Login credentials</legend>
                        <label htmlFor="username" className="form-label">Username</label>:
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          title="username"
                          value={username}
                          onChange={event => setUsername(event.target.value)}
                          placeholder="Enter your username"
                        />
                        <label htmlFor="password" className="form-label">Password</label>:
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          title="password"
                          value={password}
                          onChange={event => setPassword(event.target.value)}
                          placeholder="Enter your password"
                        />
                      </fieldset>
                      <input
                        type="submit"
                        value="Submit"
                        className="btn btn-secondary"
                        title="submit"
                      />
                    </form>
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