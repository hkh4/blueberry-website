import React, { useState, useEffect } from "react"
import blueberry from "./../../../../blueberry/program.tsx"

function Preview({ input }) {

  const [svg, setSVG] = useState(<svg></svg>)
  const [error, setError] = useState("")

  // When the input changes, call blueberry to parse
  useEffect(() => {

    setError("")
    const result = blueberry("score", input)

    // if the return type is a string, then it's an error
    if (typeof result === "string") {
      setError(result) 
    } else {
      setSVG(result)
    }

  }, [input])

  // const [svg, setSVG] = useState(<svg viewBox="0 0 200 200"></svg>)
  //
  //
  //
  // function foo() {
  //   return <text x="50" y="50">From foo</text>
  // }
  //
  // function test() {
  //   const res = foo()
  //   const x = <svg height="100" width="100" viewBox="0 0 200 200">
  //     {res}
  //   </svg>
  //   setSVG(x)
  // }

  return (
    <div id="preview">
      {error && <h3>{error}</h3>}
      {svg}
    </div>
  )

}

export default Preview
