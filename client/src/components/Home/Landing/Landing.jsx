import { useState } from "react"
import { useLogin } from "../../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import "./Landing.scss"

function Landing({ loginRef }) {

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


      <div id="landing-login" className="auth-box" ref={loginRef}>
        <div className="auth-text-box">

          <div className="auth-text">
            <span className="green-text">/</span>
            <span className="blue-text">Sign in to your account.</span>
          </div>
        </div>

        <div className="auth-form-box">
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-form-label" htmlFor="email">Email</label>
            <input
              className="auth-form-input"
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="auth-form-password-box">
              <label htmlFor="password" className="auth-form-label">Password</label>
              <span>Forgot your password?</span>
            </div>
            <input
              className="auth-form-input"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            
            <div className="remember-div">
              <input
              className="remember"
              id="remember"
              type="checkbox"
              />
              <label htmlFor="remember" className="auth-form-label remember-label">Remember me on this device</label>
            </div>

            <button className="auth-form-signin" disabled={isLoading}>
              <span>Sign in</span>
              <svg width="27" height="8" viewBox="0 0 27 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M23.3006 0.46444L26.4826 3.64642C26.6778 3.84168 26.6778 4.15826 26.4826 4.35353L23.3006 7.53551C23.1053 7.73077 22.7888 7.73077 22.5935 7.53551C22.3982 7.34025 22.3982 7.02366 22.5935 6.8284L24.9219 4.49997H0V3.49997H24.9219L22.5935 1.17155C22.3982 0.976284 22.3982 0.659702 22.5935 0.46444C22.7888 0.269178 23.1053 0.269178 23.3006 0.46444Z" fill="white"/>
              </svg>
            </button>

            <div className="auth-form-create-account">
              <span className="auth-form-new">New to blueberry guitar?</span>
              <span className="auth-form-create-account-text" onClick={e => navigate("/signup")}>Create account</span>
            </div>
            
            
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>

    </div>

  )
}

export default Landing