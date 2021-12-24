import React, { useState, useEffect } from "react"

import Editor from "./Editor/Editor"
import Preview from "./Preview/Preview"

function Document() {

  // Stuff typed into the editor
  const [input, setInput] = useState("")

  return (
    <div>
      <Editor setInput={setInput} />
      <Preview input={input} />
    </div>
  )

}

export default Document;
