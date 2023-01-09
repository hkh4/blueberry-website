import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

function Login() {
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Do not refresh page
    e.preventDefault();

    // Call the helper to log in
    await login(email, password);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button disabled={isLoading}>Login</button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default Login;
