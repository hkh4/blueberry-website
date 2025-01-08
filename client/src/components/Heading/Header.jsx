import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./Header.scss"

function Header() {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const goHome = () => {
    navigate("/home");
  };

  return (
    <div id="header">

      <nav>
        {user ? (
          <div>
            <Link to="/home">Home</Link>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <div>
            <img src="img/logo.png" id="logo" onClick={goHome} />

            <div id="buttons">
              <button id="docs">
                <Link to="/login">get started</Link>
              </button>
              <button id="signup">
                <Link to="/signup">sign up</Link>
              </button>
              <button id="login">login</button>
            </div>

          </div>
        )}
      </nav>
    </div>
  );
}

export default Header;
