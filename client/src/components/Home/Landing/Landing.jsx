import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import axios from "axios"

import { useDocumentsContext } from "./../../../hooks/useDocumentsContext"
import errorHandling from "../../../helpers/errorHandling"

function Landing() {

    const { documents, dispatch } = useDocumentsContext()

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

                if (response.status === 200) {
                    dispatch({type: 'SET_DOCUMENTS', payload: response.data})
                }

            } catch(e) {
                errorHandling(e)
            }

        })()

        return () => { 
            mounted = false 
            if (cancel) cancel()
        }

    }, [dispatch])

    return (
        <div id="home">
            <div className="documents">

                {documents.map(d => {
                    return <Link className="link" to={`documents/${d._id}`} key={d._id}>{`${d.title}`}</Link>
                })}
                <Link className="link" to={`documents/${uuidV4()}`}>New</Link>

            </div>
        </div>
    )

}

export default Landing