import { useEffect } from "react"
import blueberry from "./../../../../blueberry/program.tsx"

function Preview({
  input,
  svg,
  setSVG,
  error,
  setError,
  previewRef,
  docType
}) {

  // ******************* State

  // When the input changes, call blueberry to parse
  useEffect(() => {

    let result;

    if (docType === "tab") {
      result = blueberry("tab", input)
    } else{
      result = blueberry("lyric", input)
    }

    // if the return type is a string, then it's an error
    if (typeof result === "string") {
      setError(result)
    } else { 
      setError("")
      setSVG(result)
    }
 
  }, [input, setError, setSVG, docType])

  return (
    <div id="preview" ref={previewRef}>
      {error && <h3>{error}</h3>}
      {svg}
    </div>
  )

}

export default Preview
