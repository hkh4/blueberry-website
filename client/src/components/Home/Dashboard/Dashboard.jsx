import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";

import { useDocumentsContext } from "../../../hooks/useDocumentsContext";
import { useAuthContext } from "../../../hooks/useAuthContext"
import errorHandling from "../../../helpers/errorHandling";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

import "./Dashboard.scss"

function Dashboard() {

  const { documents, dispatch } = useDocumentsContext();
  const [tabDocuments, setTabDocuments] = useState([])
  const [lyricDocuments, setLyricDocuments] = useState([])
  const { user } = useAuthContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [cover, setCover] = useState(false)
  const [toDelete, setToDelete] = useState()

  // Load documents from database
  useEffect(() => {

    if (!user) return

    const CancelToken = axios.CancelToken;
    let cancel;
    let mounted = true;

    (async () => {

      try {
        const response = await axios.get("/api/documents/", {
          params: {
            id: user.id
          },
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });

        if (response.status === 200 && mounted) {
          dispatch({ type: "SET_DOCUMENTS", payload: response.data });
        }
        setLoading(false)
      } catch (e) {
        console.log(e)
        if (axios.isCancel(e)) return;
        errorHandling(e);
      }

    })();

    return () => {
      mounted = false;
      if (cancel) cancel();
    };

  }, [dispatch, user]);


  // When the document list changes, update the tab and lyrics lists
  useEffect(() => {

    const tabDocs = documents.filter(d => d.type === "tab")
    const lyricDocs = documents.filter(d => d.type === "lyric")

    setTabDocuments(tabDocs)
    setLyricDocuments(lyricDocs)

  }, [documents])


  // Function that loads a new document when the "New" button is clicked
  const openNewDocument = async (docType) => {

    if (!user) return

    try {
      // Get a random id
      const documentID = uuidV4();

      // Create the new document
      const response = await axios.post("/api/documents", {
        id: documentID,
        title: "Untitled",
        data: {},
        user: user.id,
        type: docType
      }, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });

      // Redirect to this new doc
      if (response.status === 200) {
        navigate(`/documents/${documentID}`);
      }
    } catch (e) {
      errorHandling(e);
    }
  }


  // function to delete a document when the trash can is clicked
  const deleteDocument = async () => {

    if (!user) return

    const id = toDelete

    try {

      // Delete the doc
      const response = await axios.delete(`/api/documents/${id}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })

      if (response.status === 200) {
        // dispatch action
        dispatch({ type: 'DELETE_DOCUMENT', payload: { id } })
        setToDelete()
        setCover(false)
      }

    } catch (e) {
      errorHandling(e)
    }
  }

  return (
    <div id="home">
      <div className="documents">
        {loading ? (
          <span>Loading...</span>
        ) : (

          <div>
            {cover &&
              <div className="cover">
                <div className="confirmation">
                  <span>Are you sure?</span>
                  <button onClick={e => deleteDocument()}>Yes</button>
                  <button onClick={e => {
                    setCover(false)
                    setToDelete()
                  }}>No</button>
                </div>
              </div>
            }

            <div id="dashboard">

              <div id="dashboard-side">
                <div id="dashboard-side-extra"></div>
              </div>

              <div>
                <h2>Tabs</h2>
                <table className="documents-table">
                  <tbody>
                    <tr>
                      <th className="documents-table-title">Title</th>
                      <th className="documents-table-modified">Last Modified</th>
                      <th className="documents-table-actions">Actions</th>
                    </tr>

                    {tabDocuments.map((d) => {

                      let date = new Date(d.updatedAt)
                      let dateString = date.toDateString() + " " + date.toTimeString().slice(0, 8)

                      return (
                        <tr key={d._id}>
                          <td>
                            <Link
                              className="link"
                              to={`/documents/${d._id}`}
                            >{`${d.title}`}</Link>
                          </td>
                          <td>{`${dateString}`}</td>
                          <td>
                            <span onClick={e => {
                              setCover(true)
                              setToDelete(d._id)
                            }}>
                              <FontAwesomeIcon icon={faTrashCan} />
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
                <button onClick={() => openNewDocument("tab")}>New</button>
              </div>

              <div>
                <h2>Lyrics</h2>
                <table className="documents-table">
                  <tbody>

                    {lyricDocuments.map((d) => {

                      let date = new Date(d.updatedAt)
                      let dateString = date.toDateString() + " " + date.toTimeString().slice(0, 8)

                      return (
                        <tr key={d._id}>
                          <td>
                            <Link
                              className="link"
                              to={`/documents/${d._id}`}
                            >{`${d.title}`}</Link>
                          </td>
                          <td>{`${dateString}`}</td>
                          <td>
                            <span onClick={e => {
                              setCover(true)
                              setToDelete(d._id)
                            }}>
                              <FontAwesomeIcon icon={faTrashCan} />
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
                <button onClick={() => openNewDocument("lyric")}>New</button>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
