import React, { useEffect, useCallback, useRef } from "react"
import blueberry from "./../../../../blueberry/program.tsx"
import { renderToString } from "react-dom/server"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

function Preview({
  input,
  svg,
  setSVG,
  error,
  setError,
  previewRef
}) {

  // ******************* State

  // When the input changes, call blueberry to parse
  useEffect(() => {

    const result = blueberry("score", input)

    // if the return type is a string, then it's an error
    if (typeof result === "string") {
      setError(result)
    } else { 
      setError("")
      setSVG(result)
    }
 
  }, [input])

  return (
    <div id="preview" ref={previewRef}>
      {error && <h3>{error}</h3>}
      {svg}
    </div>
  )

}

export default Preview
