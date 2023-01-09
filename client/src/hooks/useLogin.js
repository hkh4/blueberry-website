import { useState } from "react"
import axios from "axios"
import errorHandling from "../helpers/errorHandling"
import { useAuthContext } from "./useAuthContext"

export function useLogin() {

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        try {

            // Try to log in
            const response = await axios.post('/api/user/login', {
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

    return { login, isLoading, error }

}