import { useState } from 'react'
import { useSignup } from "../../hooks/useSignup"
import { useNavigate } from "react-router-dom"

function Signup() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {signup, error, isLoading} = useSignup()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {

        // Do not refresh page
        e.preventDefault()

        // Call helper function to sign up user
        await signup(email, password)
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <label>Email:</label>
            <input 
                type="email" 
                onChange={e => setEmail(e.target.value)}
                value={email}
            />
            <label>Password:</label>
            <input
                type="password" 
                onChange={e => setPassword(e.target.value)}
                value={password}
            />
            <button disabled={isLoading}>Sign up</button>
            {error && <span className="error">{error}</span>}
        </form>
    )

}

export default Signup