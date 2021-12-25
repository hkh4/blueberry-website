import { ScoreOption, ParserMeasure, OptionsRecord } from "./types"
import { evalOptions } from "./options"

//********************* Main Driver
export default function interpret(options: ScoreOption[], measures: ParserMeasure[]) {

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
  const [newOption, defaultRhythm] = evalOptions(options, defaultOptions)

  return <svg></svg>

}
