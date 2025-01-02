import { ScoreOption, OptionsRecord } from "./types"
import { OPTIONS, PITCHES } from "./constants"

export default function evalOptions(options: ScoreOption[], optionsR: OptionsRecord) : OptionsRecord {

  // Parse options one by one
  options.forEach(o => {

    const { option, value } = o 

    // If the option isn't a valid one, throw an error
    if (!OPTIONS.includes(option)) {
      throw new Error("Valid options are: composer, title, tuning, capo.")
    }

    // For tuning, need to make sure it follows a valid format
    if (option === "tuning") {
      let stringKeys = value.split("-")

      if (stringKeys.length !== 6) {
        throw new Error("Invalid tuning! Format is pitch-pitch-pitch-pitch-pitch-pitch. Must be a length of exactly 6.")
      }

      // Make sure they're all valid
      if (!stringKeys.every(s => PITCHES.includes(s))) {
        throw new Error("Invalid tuning! Valid pitches: a, a#, ab, b, b#, bb, c, c#, cb, d, d#, db, e, e#, eb, f, f#, fb, g, g#, gb")
      }

      // Make capital
      stringKeys = stringKeys.map(s => s.toUpperCase())

      // Create comma separated version
      const tuningString = stringKeys.join(", ")

      optionsR.tuningString = tuningString
      optionsR = {
        ...optionsR,
        tuning: stringKeys as [string, string, string, string, string, string]
      }

    } else {
      optionsR[option] = value
    }

  })

  return optionsR

}