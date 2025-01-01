import React, { useState, lazy, useRef } from "react"

const Editor = lazy(() => import("./Editor/Editor"))
const Preview = lazy(() => import("./Preview/Preview"))

function Document() {

  // ***************** State
  const [input, setInput] = useState("")
  const [svg, setSVG] = useState([])
  const [error, setError] = useState("")
  const [docType, setDocType] = useState("")

  // ***************** Refs
  const previewRef = useRef()

  return (
    <div className="document">

      <Editor
        setInput={setInput}
        previewRef={previewRef}
        previewError={error}
        setDocType={setDocType}
      />

      <Preview
        input={input}
        svg={svg}
        setSVG={setSVG}
        error={error}
        setError={setError}
        previewRef={previewRef}
        docType={docType}
        />
    </div>
  )

}

export default Document;
