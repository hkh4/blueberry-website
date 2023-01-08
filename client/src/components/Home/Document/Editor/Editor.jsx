import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import "quill/dist/quill.snow.css"
import Quill from "quill"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"

import downloadPDF from "./download_pdf"
import errorHandling from "../../../../helpers/errorHandling"

import useInterval from "./../../../../hooks/useInterval"


// Constants
const SAVE_INTERVAL_MS = 2000


function Editor({
  setInput,
  svg,
  previewRef
}) {

  const [quill, setQuill] = useState()
  const [socket, setSocket] = useState()
  const [title, setTitle] = useState("")
  const [startSaving, setStartSaving] = useState(false)
  const {id: documentID} = useParams()

  // When the compile button is clicked, get the text and send it over to Document by settings its "input" state
  function compile() {
    const text = quill.getText()
    setInput(text)
  }

  // Save the document
  async function save() {
    
    if (!quill || !socket || !startSaving) return

    return await axios.patch(`/api/documents/${documentID}`, {
      title,
      data: quill.getContents()
    })
  }

  // Custom interval hook to save automatically
  useInterval(save, SAVE_INTERVAL_MS, [socket, quill, startSaving])


  // Set up quill
  const wrapperRef = useCallback(wrapper => {

    if (wrapper == null) return

    wrapperRef.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: [[{'font': []}, {'color': []}], ['bold', 'italic', 'underline', 'strike']] } })

    // Quill is disabled to start, until data is loaded from mongodb
    q.disable()
    q.setText('Loading...')
    setQuill(q)

  }, [])


  // Set up socket.io
  useEffect(() => {
    const s = io("http://localhost:5000")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])


  // When the text on the screen changes, send it to the server, which will then send the changes to everyone else in the document
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])


  // Receive changes from the server (from other users in this doc)
  useEffect(() => {

    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }

    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }

  }, [socket, quill])


  // When the document first loads, query mongodb to see if this document has saved data and load it
  useEffect(() => {

    console.log("reset")

    if (socket == null || quill == null) return 

    // Use this document's id to query database
    socket.emit("get-document", documentID)

    // Retrieve saved data, load it into quill, and enable editing
    socket.once("load-document", document => {
      quill.setContents(document.data)
      setTitle(document.title)
      setStartSaving(true)
      quill.enable()
    })

  }, [socket, quill, documentID])


  return (
    <>
    <div className="editor">
      <input maxLength="50" value={title} onChange={e => setTitle(e.target.value)} type="text" />
      <div id="container" ref={wrapperRef}></div>

      <div className="editor-buttons">
        <button className="button compile" onClick={compile}>Compile</button>
        <button className="button download" onClick={() => downloadPDF(previewRef)}>Download PDF</button>
        <button className="button save" onClick={save}>Save</button>
      </div>
      
    </div>
    </>
  )

}

export default Editor
