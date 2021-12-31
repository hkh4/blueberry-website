import { useCallback, useState, useEffect } from "react"
import "quill/dist/quill.snow.css"
import Quill from "quill"
import { io } from "socket.io-client"


function Editor({ setInput }) {

  const [quill, setQuill] = useState()
  const [socket, setSocket] = useState()


  // When the compile button is clicked, get the text and send it over to Document by settings its "input" state
  function compile() {
    const text = quill.getText()
    setInput(text)
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
      <div id="container" ref={wrapperRef}></div>
      <button className="compile" onClick={compile}>Compile</button>

    </div>
  )

}

export default Editor
