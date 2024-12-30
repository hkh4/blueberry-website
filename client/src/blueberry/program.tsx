import { grammar } from "./tabs/parser"
import interpret from "./tabs/interpreter"
import { ReactElement } from "react"
import { PreviousPageCode } from "./tabs/types"

export default function main(programType: string, input: string) : ReactElement | string {

  try {

    if (programType === "score") { 

      const result = grammar.tryParse(input) 
 
      const [options, variables, measures] = result

      const svg = interpret(options, variables, measures)

      return svg

    } else {
      return "oops"
    }

  } catch(e: any) {
    console.log(e?.message)
    return e?.message
  }
}
