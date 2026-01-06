import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./Header.scss"

function Header({ loginRef }) {

  const { logout } = useLogout();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  // Scroll to login when button is clicked
  const scrollToLogin = () => {
    loginRef.current.scrollIntoView({ behavior: "smooth" })
  }
 
  return (

    <div id="header">

      <img src="img/logo.png" id="logo" onClick={e => navigate("/home")} />

      <div id="buttons">

        <button id="docs">
          <a href="https://docs.blueberryguitar.com">get started</a>
        </button>

        {user ? (
          <>
          <button id="logout" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
          <button id="signup" onClick={e => navigate("/signup")}>
            <Link to="/signup">sign up</Link>
          </button>
          <button id="login" onClick={e => scrollToLogin()}>login</button>
          </>
        )}

      </div>

    </div>

  );
}

export default Header;
