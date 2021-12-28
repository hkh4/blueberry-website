import { ScoreOption, OptionsRecord, RhythmNumber, isRhythmNumber, isKey, isInts } from "./types"

// *********************** Evaluate options

/*
Parses all options, and returns an updated OptionsRecord
1. options: list of ScoreOptions
2. optionsR: OptionsRecord that contains the defaults, and will be returned
RETURNS updated OptionsRecord
*/
export function evalOptions(options: ScoreOption[], optionsR: OptionsRecord) : [OptionsRecord, [RhythmNumber, number]] {

  // initial default rhythm
  let defaultRhythm : [RhythmNumber, number] = [4,0]

  // Parse the options one by one
  options.forEach(o => {

    const { option, value } = o

    // See what type of option it is
    switch (option) {
      case "time":

        const tArray = value.split("-")
        // Truncate to make sure everything is a whole number
        const timeArray = tArray.map(t => {
          return parseInt(t)
        })

        // Must be of length 2
        if (timeArray.length !== 2) throw new Error("The time option should be of the form Number-Number")

        const [top, bottom] = timeArray

        // First number must be 1-32 or 64
        if (top < 1 || (top > 32 && top !== 64)) {
          throw new Error("The top number of the time signature must be a number from 1-32 or 64")
        }

        // Second number
        if (!isRhythmNumber(bottom)) {
          throw new Error("The bottom number of the time signature must be 1, 2, 4, 8, 16, 32, or 64")
        }

        defaultRhythm = [bottom, 0]

        optionsR.time = [top, bottom]

        break;

      case "key":

        if (!isKey(value)) {
          throw new Error("Invalid key! Valid keys are c, cm, c#, c#m, cb, d, dm, db, d#m, e, em, eb, ebm, f, fm, f#, f#m, g, gm, gb, g#m, a, am, ab, abm, a#m, b, bm, bb, bbm")
        }

        optionsR.key = value

        break;

      case "capo":

        const capo = parseInt(value)
        if (!isInts(capo)) {
          throw new Error("Invalid capo! Must be a number from 0-20.")
        }

        optionsR.capo = capo

        break;

      case "title":

        optionsR.title = value
        break;

      case "composer":

        optionsR.composer = value
        break;

      case "tuning":

        optionsR.tuning = value

        // figure out the tuningNumbers

        // Split into the pitches
        const stringKeys = value.split("-")

        if (stringKeys.length !== 6) {
          throw new Error("Invalid tuning! Format is pitch-pitch-pitch-pitch-pitch-pitch. Must be a length of exactly 6.")
        }

        const tuningNumbers = stringKeys.map(s => {
          switch (s) {
            case "e":
            case "fb":
              return 0
            case "f":
            case "e#":
              return 11
            case "f#":
            case "gb":
              return 10
            case "g":
              return 9
            case "g#":
            case "ab":
              return 8
            case "a":
              return 7
            case "a#":
            case "bb":
              return 6
            case "b":
            case "cb":
              return 5
            case "c":
            case "b#":
              return 4
            case "c#":
            case "db":
              return 3
            case "d":
              return 2
            case "d#":
            case "eb":
              return 1
            default:
              throw new Error("Invalid tuning. The pitches in the tuning must be one of the following: e, eb, e#, fb, f, f#, gb, g, g#, ab, a, a#, bb, b, b#, cb, c, c#, db, d, d#")
          }
        })

        optionsR.tuningNumbers = tuningNumbers

        break;

      default:
        throw new Error("Invalid option! Valid options are key, title, composer, capo, tuning, and time")
    }

  })

  return [optionsR, defaultRhythm]

}



/* Helper method to evaluate options between measures for time, key, and capo changes
1. o: option to parse
2. optionsR: record of options
3. lastMeasureNumber: the measure number of the measure that can before this option. Used for debugging
*/
export function evalInnerOption(o: ScoreOption, optionsR: OptionsRecord, lastMeasureNumber: number) : [OptionsRecord, "time" | "key" | "capo"] {

  const { option, value } = o

  // See what type of option it is
  switch (option) {
    case "key":

      if (!isKey(value)) {
        throw new Error(`Invalid key in key change after measure ${lastMeasureNumber}! Valid keys are c, cm, c#, c#m, cb, d, dm, db, d#m, e, em, eb, ebm, f, fm, f#, f#m, g, gm, gb, g#m, a, am, ab, abm, a#m, b, bm, bb, bbm`)
      }

      optionsR.key = value
      break;

    case "time":

      const tArray = value.split("-")
      // Truncate to make sure everything is a whole number
      const timeArray = tArray.map(t => {
        return parseInt(t)
      })

      // Must be of length 2
      if (timeArray.length !== 2) throw new Error(`The time change after measure ${lastMeasureNumber} should be of the form Number-Number`)

      const [top, bottom] = timeArray

      // First number must be 1-32 or 64
      if (top < 1 || (top > 32 && top !== 64)) {
        throw new Error(`Error in the time change after measure ${lastMeasureNumber}! The top number of the time signature must be a number from 1-32 or 64`)
      }

      // Second number
      if (!isRhythmNumber(bottom)) {
        throw new Error(`Error in the time change after measure ${lastMeasureNumber}! The bottom number of the time signature must be 1, 2, 4, 8, 16, 32, or 64`)
      }

      optionsR.time = [top, bottom]

      break;

    case "capo":

      const capo = parseInt(value)
      if (!isInts(capo)) {
        throw new Error(`Error in the capo change after measure ${lastMeasureNumber}! Must be a number from 0-20.`)
      }

      optionsR.capo = capo

      break;

    default:
      throw new Error(`Invalid option after measure ${lastMeasureNumber}! The only options that can be changed between measures are the time, key, or capo.`)
  }

  return [optionsR, option]

}
