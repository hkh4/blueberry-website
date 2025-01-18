import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./Footer.scss"

function Footer({ loginRef }) {

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
    <div id="footer">

      <img src="./img/logo-mini.png" id="footer-logo-mini" onClick={e => navigate("/home")} />

      <div id="footer-credit">
        <p>Blueberry Guitar</p>
        <p>created by Hugo Hua</p>
      </div>

      <div id="footer-social">
        <div className="footer-social-circle">
          <span>Fb</span>
        </div>
        <div className="footer-social-circle">
          <span>In</span>
        </div>
        <div className="footer-social-circle">
          <span>Be</span>
        </div>
        <div className="footer-social-circle">
          <span>Li</span>
        </div>
      </div>

      <div id="footer-copyright">
        {
          <span>&copy;{new Date().getFullYear()}. </span>
        }
        <span>All Rights Reserved.</span>
      </div>

      <div id="footer-links">
        <Link to="/home" className={`footer-link ${location.pathname === "/home" && "footer-link-active"}`}>Home</Link>

        {user ? (
          <span className="footer-link" onClick={handleLogout}>Logout</span>
        ) : (
          <span className="footer-link" onClick={e => scrollToLogin()}>Login</span>
        )}
        <Link to="/signup" className={"footer-link"}>Sign Up</Link>
        <Link to="/docs" className={"footer-link"}>Docs</Link>
      </div>

    </div>
  )

}

export default Footer;