import { useCallback, useState, useEffect } from "react"
import "quill/dist/quill.snow.css"
import Quill from "quill"
import { io } from "socket.io-client"
import jsPDF from "jspdf"


function Editor({
  setInput,
  svg,
  numberOfPages,
  error,
  previewRef
}) {

  const [quill, setQuill] = useState()
  const [socket, setSocket] = useState()


  // When the compile button is clicked, get the text and send it over to Document by settings its "input" state
  function compile() {
    const text = quill.getText()
    setInput(text)
  }


  // Download as a pdf
  async function downloadPDF() {

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

      doc.save("test.pdf")

    } catch(e) {
      console.log(e)
    }

  }



  // set up socket.io
  useEffect(() => {
    const s = io("http://localhost:5000")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  // when the text on the screen changes, send
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


  // receive changes
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



  // set up quill
  const wrapperRef = useCallback(wrapper => {

    if (wrapper == null) return

    wrapperRef.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: [] } })
    setQuill(q)

  }, [])

  return (
    <div className="editor">
      <canvas height="7920" width="6120" id="canvas"></canvas>
      <div id="container" ref={wrapperRef}></div>
      <button className="compile" onClick={compile}>Compile</button>
      <button className="download" onClick={downloadPDF}>Download PDF</button>
    </div>
  )

}

export default Editor
