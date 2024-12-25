import React, { useState, lazy, useRef } from "react"

const Editor = lazy(() => import("./Editor/Editor"))
const Preview = lazy(() => import("./Preview/Preview"))

function Document() {

  // ***************** State
  const [input, setInput] = useState("") 
  const [svg, setSVG] = useState([])
  const [error, setError] = useState("")

  // ***************** Refs
  const previewRef = useRef()

  return (
    <div className="document">

      <Editor
        setInput={setInput}
        previewRef={previewRef}
        previewError={error}
      />

      <Preview
        input={input}
        svg={svg}
        setSVG={setSVG}
        error={error}
        setError={setError}
        />
    </div>
  )

}

export default Document;
