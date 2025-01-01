import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import "quill/dist/quill.snow.css"
import Quill from "quill"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
import jsPDF from "jspdf"

import errorHandling from "../../../../helpers/errorHandling"

import useInterval from "./../../../../hooks/useInterval"
import { useAuthContext } from "./../../../../hooks/useAuthContext"


// Constants
const SAVE_INTERVAL_MS = 2000


function Editor({
  setInput,
  previewRef,
  setDocType
}) {

  const [quill, setQuill] = useState()
  const [socket, setSocket] = useState()
  const [title, setTitle] = useState("")
  const [startSaving, setStartSaving] = useState(false)
  const [shareEmail, setShareEmail] = useState("") 
  const [shareOpen, setShareOpen] = useState(false)
  const [shareError, setShareError] = useState(null)
  const {id: documentID} = useParams()
  const { user } = useAuthContext()

  // When the compile button is clicked, get the text and send it over to Document by settings its "input" state
  function compile() {
    const text = quill.getText()
    setInput(text)
  }

  // Save the document
  async function save() {

    try {

      if (!quill || !socket || !startSaving || !user || !documentID) return

      return await axios.patch(`/api/documents/${documentID}`, {
        title,
        data: quill.getContents()
      }, {
        headers: {
          "Authorization" : `Bearer ${user.token}`
        }
      })

    } catch(e) {
      errorHandling(e)
    }
  
  }

  // Custom interval hook to save automatically
  useInterval(save, SAVE_INTERVAL_MS, [socket, quill, startSaving, user])

  // Share the document with another user
  async function shareDocument(e) {

    try {

      e.preventDefault()

      if (!user || !documentID) return

      setShareError(null)

      // Patch request to share
      await axios.patch(`/api/documents/share/${documentID}`, {
        email: shareEmail
      }, {
        headers: {
          "Authorization" : `Bearer ${user.token}`
        }
      })

      setShareOpen(false)
      

    } catch(e) {
      setShareError(e?.response?.data?.error?.message || e.message || "Error")
      errorHandling(e)
    }

  }


  // Reset measure numbers, tab all notes
  function reformat() {

    // Grab plaintext from quill
    const text = quill.getText()

    const lines = text.split("\n")

    // **************** Methodology:
    // Go line by line until you reaching a line that contains a ":", which marks the first measure

    let measuresStart = false
    let measureNumber = 1

    let newLines = []

    lines.forEach(l => {
      
      // If we're currently working on measures, start looking for notes to tab
      if (measuresStart || l.includes(":")) {
        measuresStart = true

        // If there's a colon, then this is a measure number
        if (l.includes(":")) {

          // Push the current measure number
          let newL = `${measureNumber}:`
          measureNumber++
          newLines.push(newL) 

        } else if (l.includes("-")) {
          // If there's a dash, it must be an option
          newLines.push(l.trim())

        } else {
          // Otherwise, it must be a note. Make sure there's a tab
          const lWithoutTab = l.split("\t").slice(-1)
          const newL = `\t${lWithoutTab}`
          newLines.push(newL)
        }

      } else {
        // if we're still in the beginning options, just strip the whitespace
        newLines.push(l.trim())
      }

    })

    const finalText = newLines.join("\n")
    
    quill.setText(finalText)

    compile()

  }


  // Set up quill
  const wrapperRef = useCallback(wrapper => {

    if (wrapper == null) return

    wrapper.innerHTML = ""
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

    const ENDPOINT = process.env.NODE_ENV === "production" ? 'https://blueberryguitar.com' : 'http://localhost:6500'

    const s = io(ENDPOINT) 
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])


  // When the text on the screen changes, send it to the server, which will then send the changes to everyone else in the document
  useEffect(() => {
    if (!socket || !quill) return

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

    if (!socket || !quill) return

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

    if (!socket || !quill || !documentID || !user) return 

    const CancelToken = axios.CancelToken
    let cancel;
    let mounted = true;

    (async () => {

      try {

        // Get the document data
        const response = await axios.get(`/api/documents/${documentID}`, {
          cancelToken: new CancelToken(c => {
            cancel = c
          }),
          headers: {
            "Authorization" : `Bearer ${user.token}`
          }
        })

        if (response.status === 200 && mounted) {

          // Set state
          setTitle(response.data.title)
          setDocType(response.data.type)
          quill.setContents(response.data.data)
          quill.history.clear()

          // Use this document's id to join a room
          socket.emit("join-document-room", documentID)

          // Retrieve saved data, load it into quill, and enable editing
          socket.once("joined-document-room", () => {
            setStartSaving(true)
            quill.enable()
          })

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

  }, [socket, quill, documentID, user]) 


  // Download PDF
  const downloadPDF = useCallback(async (previewRef, title) => {
  
    try {
  
      // Get the preview box
      const previewBox = previewRef.current
      // The actual SVGs within
      const children = Array.from(previewBox.children)
  
      // Initialize the doc
      const doc = new jsPDF({
        unit: "px",
        format: [612, 792],
        compress: true
      })
      doc.deletePage(1)
  
      // Loop through each page
      await Promise.all(children.map(async (child) => {
  
        // Get the canvas
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set the background to be white
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
  
        // Turn the svg code into a string that can be used later when making the image
        const data = (new XMLSerializer()).serializeToString(child);
        const DOMURL = window.URL || window.webkitURL || window;
  
        // Initialize the new image and pass the serialized data to a Blob
        const img = new Image();
        const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        const url = DOMURL.createObjectURL(svgBlob);
  
        img.src = url;
  
        // Once the image loads, draw on it
        return new Promise((resolve, reject) => {
          img.onload = function() {
  
            ctx.drawImage(img, 0, 0);
  
            const imgURI = canvas
              .toDataURL('image/png')
              .replace('image/png', 'image/octet-stream');
  
            // Create a new page on the pdf
            doc.addPage()
  
            // Draw the image on the new pdf page
            doc.addImage(imgURI, "PNG", 0, 0, 612, 792, '', 'FAST')
  
            // Clear the canvas for the next page
            ctx.clearRect(0, 0, canvas.width, canvas.height);
  
            // Resolve this promise
            resolve()
          };
        })
  
      }))
  
      doc.save(`${title}.pdf`)
  
    } catch(e) {
      console.log(e)
    }
  
  }, [previewRef.current])


  return (
    <>
    <div className="editor">
      <canvas height="7920" width="6120" id="canvas"></canvas>
      <input maxLength="50" value={title} onChange={e => setTitle(e.target.value)} type="text" />
      <div id="container" ref={wrapperRef}></div>

      <div className="editor-buttons">
        <button className="button compile" onClick={compile}>Compile</button>
        <button className="button share" onClick={e => setShareOpen(true)}>Share</button>
        <button className="button download" onClick={() => downloadPDF(previewRef, title)}>Download PDF</button>
        <button className="button save" onClick={save}>Save</button>
        <button className="button reformat" onClick={reformat}>Reformat</button>
      </div>

      {shareOpen && 
      <div className="share-popup">
      <form className="share-form" onSubmit={shareDocument}>
        <h3>Share This Document</h3>
        <label>Enter an email:</label>
        <input 
          type="email"
          onChange={e => setShareEmail(e.target.value)}
          value={shareEmail}
        />
        <button>Share</button>
        {shareError && <span className="error">{shareError}</span>}
      </form>
    </div>}
      
    </div>
    </>
  )

}

export default Editor
