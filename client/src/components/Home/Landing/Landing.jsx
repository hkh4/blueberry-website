import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import axios from "axios"

import { useDocumentsContext } from "./../../../hooks/useDocumentsContext"
import errorHandling from "../../../helpers/errorHandling"

function Landing() {

    const { documents, dispatch } = useDocumentsContext()
    const navigate = useNavigate()

    // Load documents from database
    useEffect(() => {

        const CancelToken = axios.CancelToken;
        let cancel;
        let mounted = true;

        (async () => {

            try {

                const response = await axios.get("/api/documents/", {
                    cancelToken: new CancelToken(function executor(c) {
                        cancel = c
                    })
                })

                if (response.status === 200 && mounted) {
                    dispatch({type: 'SET_DOCUMENTS', payload: response.data})
                }

            } catch(e) {
                if (axios.isCancel(e)) return
                errorHandling(e)
            }

        })()

        return () => { 
            mounted = false 
            if (cancel) cancel()
        }

    }, [dispatch])

    // Function that loads a new document when the "New" button is clicked
    async function openNewDocument() {

        try {

            // Get a random id
            const documentID = uuidV4()

            // Create the new document
            const response = await axios.post("/api/documents", {
                id: documentID,
                title: "Untitled",
                data: {}
            })

            console.log(response)

            // Redirect to this new doc
            if (response.status === 200) {
                console.log("in")
                navigate(`/documents/${documentID}`)
            }
            

        } catch(e) {
            errorHandling(e)
        }

    }


    return (
        <div id="home">
            <div className="documents">

                {documents.map(d => {
                    return <Link className="link" to={`documents/${d._id}`} key={d._id}>{`${d.title}`}</Link>
                })}
                <button onClick={openNewDocument}>New</button>
                <Link className="link" to={`documents/${uuidV4()}`}>New</Link>

            </div>
        </div>
    )

}

export default Landing