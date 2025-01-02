import { Barre, Dot, X, Note, Chart, Line, ScoreOption, GuitarString } from "./types"
import { word, singleSpace, spaces, regularSpace, emptySpaces, emptySpaces1, spacesAndNewline, emptyLines, restOfLine, stringNum, digits } from "./../shared/parser_shared"
const P = require("parsimmon")


/* --------------------------------- Options -------------------------------- */

// After the '-', there needs to be a word followed
const optionWord = word.skip(emptySpaces1)
const optionIdentifier = P.string("-")
  .then(optionWord)
  .desc("a dash followed by an option descriptor")

const singleOption = P.seqMap(optionIdentifier, restOfLine, P.newline, function(option, value, _) {
  const result: ScoreOption = {
    option,
    value
  }
  return result
})

const options = singleOption.trim(spaces).many()



/* ------------------------------ Chart parsing ----------------------------- */

// Dots look like "1-2" where 1 is the string and 2 is the fret
const dash = P.string("-")
const dot = P.seqMap(stringNum, dash, digits, (s1, _, s2) => {
  const d : Dot = {
    kind: "dot",
    string: s1,
    fret: s2
  }
  return d
})

// "1-x" for example, string 1 with an x
const x = P.string("x")
const xNote = stringNum
  .skip(dash)
  .skip(x)
  .map(n => {
    const xFinal : X = {
      kind: "x",
      string: n
    }
    return xFinal
  })

// A barre is of form 1-6-3 where the first two numbers are the string range and the final is the fret
const barre = P.seqMap(stringNum, dash, stringNum, dash, P.digits, (s1, _, s2, __, s3) => {

  // If the start and end string are the same, return a dot instead
  if (s1 === s2) {
    const d : Dot = {
      kind: "dot",
      string: s1,
      fret: s3
    }
    return d
  } else {
    const strings = [s1, s2].sort((a,b) => a - b)
    const b : Barre = {
      kind: "barre",
      strings: strings as [GuitarString, GuitarString],
      fret: s3
    }
    return b
  }
})

// Any note
const note = P.alt(barre, dot, xNote).trim(spaces)
const notes = note.many()

const b1 = P.string("[").skip(spaces)
const b2 = P.string("]").skip(spaces)

// Full chart
const title = P.string("title:").then(restOfLine).skip(P.newline)

const chart = P.seq(title, notes)
  .wrap(b1, b2)
  .map(([t, n]) => {
    const c : Chart = {
      title: t,
      notes: n
    }
    return c
  })
  .desc("Valid entries for a chart include one of the following forms: 2-4, 1-6-4, 3-x")

const charts = chart.many()

/* --------------------------------- Lyrics --------------------------------- */

const line = restOfLine
  .map(s => {
    return s as Line
  })

const lines = line.sepBy(P.newline)


/* ---------------------------------- Final --------------------------------- */

const expr = P.seq(options, charts, lines).trim(spaces)

export const lyricGrammer = expr.skip(P.eof)