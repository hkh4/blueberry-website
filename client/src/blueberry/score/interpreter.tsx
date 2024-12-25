import { ScoreOption, OptionsRecord, Expr, Variable } from "./types"
import { evalOptions } from "./options"
import { evalVariables } from "./variables"
import { evalMeasures, divideLines, dividePages } from "./divide"
import { show } from "./graphics"
import { ReactElement } from "react"

/********************* Main Driver
1. options: options at the beginning of the document
2. variables: variables for reusing blueberry code
3. elements: measures, and possible key/capo/time change options within
*/
export default function interpret(options: ScoreOption[], variables: Variable[], elements: Expr[]) : ReactElement {

  // Default options
  const defaultOptions : OptionsRecord = {
    time: [4,4],
    key: "c",
    capo: 0,
    title: "Untitled",
    composer: "Unknown",
    tuning: "standard",
    tuningNumbers: [0,7,2,9,5,0]
  }

  // First, parse the options
  const [optionsR, defaultRhythm] = evalOptions(options, defaultOptions)

  // Then, parse the variables
  const allVariables = evalVariables(variables)

  // Next, evaluate the measures
  const measures = evalMeasures(elements, allVariables, optionsR, defaultRhythm)

  // Split the measures into lines
  const lines = divideLines(measures)

  // Split the lines into pages
  const pages = dividePages(lines)

  // Showtime!
  const [newPages, resultSVG] = show(pages, optionsR)

  return resultSVG

}
