import { useState } from 'react'
import { useSignup } from "../../hooks/useSignup"
import { useNavigate } from "react-router-dom"

import "./Signup.scss"

function Signup() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signup, error, isLoading } = useSignup()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    // Do not refresh page
    e.preventDefault()

    // Call helper function to sign up user
    await signup(email, password)
  }

  return (
    <div id="signup" className="auth-box">
      <div className="auth-text-box">

        <div className="auth-text">
          <span className="green-text">/</span>
          <span className="blue-text">Create an account.</span>
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
              <path fillRule="evenodd" clipRule="evenodd" d="M23.3006 0.46444L26.4826 3.64642C26.6778 3.84168 26.6778 4.15826 26.4826 4.35353L23.3006 7.53551C23.1053 7.73077 22.7888 7.73077 22.5935 7.53551C22.3982 7.34025 22.3982 7.02366 22.5935 6.8284L24.9219 4.49997H0V3.49997H24.9219L22.5935 1.17155C22.3982 0.976284 22.3982 0.659702 22.5935 0.46444C22.7888 0.269178 23.1053 0.269178 23.3006 0.46444Z" fill="white" />
            </svg>
          </button>

          {error && <span className="error">{error}</span>}
        </form>
      </div>
    </div>
  )

}

export default Signup