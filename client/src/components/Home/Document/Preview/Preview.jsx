import React, { useRef, useState } from "react"
import blueberry from "./../../../../blueberry/program.ts"

function Preview({ input }) {

  const [svg, setSVG] = useState(<svg viewBox="0 0 200 200"></svg>)



  function foo() {
    return <text x="50" y="50">From foo</text>
  }

  function test() {
    const res = foo()
    const x = <svg height="100" width="100" viewBox="0 0 200 200">
      {res}
    </svg>
    setSVG(x)
  }

  return (
    <div id="preview">
      <button onClick={test}>Test</button>
      {svg}
    </div>
  )

}

export default Preview
