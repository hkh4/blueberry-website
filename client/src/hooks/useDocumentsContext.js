import { DocumentsContext } from "./../contexts/DocumentsContext"
import { useContext } from "react"

export function useDocumentsContext() {
    const context = useContext(DocumentsContext)

    if (!context) {
        let err = new Error("Cannot access document context outside provider")
        err.status = 500
        err.redirect = true
    }

    return context
}