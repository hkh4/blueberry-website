import { useCallback, useRef, useState, useEffect } from "react"
import axios from "axios"
import "quill/dist/quill.snow.css"
import Quill from "quill"
import { io } from "socket.io-client"


function Editor() {

  const [quill, setQuill] = useState()
  const [socket, setSocket] = useState()

  async function test() {

    let contents = quill.getContents()
    console.log(contents)
    let text = contents.ops[0].insert
    console.log(text)
    const result = await axios.post("/api/test", {
      data: text
    })

    console.log(result)

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
    <div>
      <div id="container" ref={wrapperRef}></div>
      <button onClick={test}>Click</button>
    </div>
  )

}

export default Editor
