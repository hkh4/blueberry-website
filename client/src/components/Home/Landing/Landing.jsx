import { useState } from "react"
import { useLogin } from "../../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import "./Landing.scss"

function Welcome() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Do not refresh page
    e.preventDefault();

    // Call the helper to log in
    await login(email, password);
  };

  return (
    <div id="landing">
      <div id="landing-top">

        <div id="landing-text" className="landing-box">

          <div id="landing-header">
            <span className="green-text">/</span>
            <span className="blue-text">Create Guitar Tabs</span>
          </div>

          <div id="landing-description">
            <p>
              Blueberry simplifies music creation with an easy-to-use interface. It offers two modes: Score Mode for fingerstyle guitar tablature and Lyric Mode for traditional guitar tabs with lyrics, chord charts, and placements.
            </p>
          </div>

        </div>


        <div id="landing-image" className="landing-box">
          <img src="./img/blueberry-example.png" />
        </div>
      </div>



      <div id="landing-login">
        <div id="landing-login-text-box">

          <div id="landing-login-text">
            <span className="green-text">/</span>
            <span className="blue-text">Sign in to your account.</span>
          </div>
        </div>

        <div id="landing-login-form-box">
          <form id="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button disabled={isLoading}>Login</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>

    </div>

  )
}

export default Welcome