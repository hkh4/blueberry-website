import { ScoreOption, OptionsRecord, Expr } from "./types"
import { evalOptions } from "./options"
import { evalMeasures } from "./divide"

/********************* Main Driver
1. options: options at the beginning of the document
2. elements: measures, and possible key/capo/time change options within
*/
export default function interpret(options: ScoreOption[], elements: Expr[]) {

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

  // Next, evaluate the measures
  const measures = evalMeasures(elements, optionsR, defaultRhythm)

  return <svg></svg>

}
