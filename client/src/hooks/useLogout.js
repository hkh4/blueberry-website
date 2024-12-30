import { useAuthContext } from "./useAuthContext"

export function useLogout() {

    const { dispatch } = useAuthContext()

    const logout = () => {
        // Remove user and expiry from storage
        localStorage.removeItem("user")

        // Dispatch logout action
        dispatch({type: 'LOGOUT'})
    }

    return { logout }

}