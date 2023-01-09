import { AuthContext } from "./../contexts/AuthContext"
import { useContext } from "react"

export function useAuthContext() {
    const context = useContext(AuthContext)

    if (!context) {
        let err = new Error("Cannot access auth context outside provider")
        err.status = 500
        err.redirect = true
    }

    return context

}