import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";

import { useDocumentsContext } from "./../../../hooks/useDocumentsContext";
import { useAuthContext } from "./../../../hooks/useAuthContext"
import errorHandling from "../../../helpers/errorHandling"; 

function Landing() {
    
  const { documents, dispatch } = useDocumentsContext();
  const { user } = useAuthContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)

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
            "Authorization" : `Bearer ${user.token}`
          }
        });

        if (response.status === 200 && mounted) {
          dispatch({ type: "SET_DOCUMENTS", payload: response.data });
        }
        setLoading(false)
      } catch (e) {
        if (axios.isCancel(e)) return;
        errorHandling(e);
      }

    })();

    return () => {
      mounted = false;
      if (cancel) cancel();
    };

  }, [dispatch, user]);

  // Function that loads a new document when the "New" button is clicked
  async function openNewDocument() {

    if (!user) return

    try {
      // Get a random id
      const documentID = uuidV4();

      // Create the new document
      const response = await axios.post("/api/documents", {
        id: documentID,
        title: "Untitled",
        data: {},
        user: user.id
      }, {
        headers: {
          "Authorization" : `Bearer ${user.token}`
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

  return (
    <div id="home">
      <div className="documents">
        {loading ? (
          <span>Loading...</span>
        ) : (
          documents.map((d) => {
            return (
              <Link
                className="link"
                to={`/documents/${d._id}`}
                key={d._id}
              >{`${d.title}`}</Link>
            );
          })
        )}
        <button onClick={openNewDocument}>New</button>
      </div>
    </div>
  );
}

export default Landing;
