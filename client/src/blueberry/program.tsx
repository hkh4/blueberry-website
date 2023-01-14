import { grammar } from "./score/parser"
import interpret from "./score/interpreter"
import { ReactElement } from "react"
import { PreviousPageCode } from "./score/types"

export default function main(programType: string, input: string) : ReactElement | string {

  try {

    if (programType === "score") { 

      const result = grammar.tryParse(input)
      console.log(result)
 
      const [options, variables, measures] = result

      const svg = interpret(options, measures)

      return svg

    } else {
      return "oops"
    }

  } catch(e: any) {
    console.log(e?.message)
    return e?.message
  }
}
