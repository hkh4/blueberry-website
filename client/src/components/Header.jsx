import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "./../hooks/useLogout";
import { useAuthContext } from "./../hooks/useAuthContext";

function Header() {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
    // redirect to the home page
    navigate("/home");
  };

  return (
    <div className="header">
      <Link to="/home">Home</Link>

      <nav>
        {user ? (
          <div>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Header;
