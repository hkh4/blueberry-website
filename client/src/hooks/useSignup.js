import { useState } from "react"
import axios from "axios"
import errorHandling from "../helpers/errorHandling"
import { useAuthContext } from "./useAuthContext"

export function useSignup() {

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)

        try {

            // Try to sign up a new user
            const response = await axios.post('/api/user/signup', {
                email,
                password
            })

            // Save the user to local storage
            localStorage.setItem('user', JSON.stringify(response.data)) 
            
            // Update the auth context
            dispatch({type: 'LOGIN', payload: response.data})

            setIsLoading(false)

        } catch(e) {
            setIsLoading(false)
            setError(e?.response?.data?.error?.message || e.message || "Error")
            errorHandling(e)
        }
    }

    return { signup, isLoading, error }

}