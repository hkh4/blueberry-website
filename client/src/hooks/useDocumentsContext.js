import { DocumentsContext } from "./../contexts/DocumentsContext"
import { useContext } from "react"

export const useDocumentsContext = () => {
    const context = useContext(DocumentsContext)

    if (!context) {
        throw Error("useDocumentsContext must be used inside a DocumentsContextProvider")
    }

    return context
}