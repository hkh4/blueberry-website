import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // At first render, check to see if already logged in
    useEffect(() => {

        // Get user from localstorage
        const user = JSON.parse(localStorage.getItem("user"))

        if (!user) {
            dispatch({ type: 'LOGOUT' })
            return
        }

        // If the token has expired, logout
        const expiry = user.expiry
        const now = Math.floor(Date.now() / 1000)
        if (now > expiry) {
            dispatch({ type: 'LOGOUT' })
            return
        }

        // Update the state if user exists. 
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }

    }, [])

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}