import { grammar } from "./score/parser"
import interpret from "./score/interpreter"

export default function main(programType: string, input: string) {

  try {

    if (programType === "score") {

      const result = grammar.tryParse(input)

      const [options, measures] = result

      const svg = interpret(options, measures)

      return svg

    }

  } catch(e: any) {
    console.log(e?.message)
    return e?.message
  }
}
