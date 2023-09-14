import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "src/context/userContext";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleToggle = () => setExpanded(!expanded);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="dragon logo" className="logo" />
          </Link>
          <button
            type="button"
            title="toggle navbar"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-content"
            aria-controls="navbar-content"
            aria-expanded={expanded}
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`} id="navbar-content">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {state.currentUser && (
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
              )}
              {state.currentUser ? (
                <li className="nav-item">
                  <button
                    type="button"
                    title="logout button"
                    onClick={async () => {
                      try {
                        const response = await fetch("http://localhost:3000/api/users/logout", {
                          method: "GET",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json"
                          }
                        });

                        if (response.ok) {
                          navigate("/login");
                        }
                      } catch (error) {
                        console.error(`Error logging out: ${error}`);
                      }
                    }}
                    className="btn btn-danger"
                  >Logout</button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;