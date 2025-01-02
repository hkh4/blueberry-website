import { tabGrammar } from "./tabs/parser"
import { lyricGrammer } from "./lyrics/parser"
import tabInterpret from "./tabs/interpreter"
import { ReactElement } from "react"
import { PreviousPageCode } from "./tabs/types"
import lyricInterpret from "./lyrics/interpreter"

export default function main(programType: string, input: string) : ReactElement | string {

  try {

    if (input.trim() === "") {
      return ""
    }

    if (programType === "tab") { 

      const result = tabGrammar.tryParse(input) 
 
      const [options, variables, measures] = result

      const svg = tabInterpret(options, variables, measures)

      return svg

    } else {
      
      const result = lyricGrammer.tryParse(input)

      const [options, charts, lines] = result
      
      const svg = lyricInterpret(options, charts, lines)

      return svg
    }

  } catch(e: any) {
    console.log(e?.message)
    return e?.message
  }
}
