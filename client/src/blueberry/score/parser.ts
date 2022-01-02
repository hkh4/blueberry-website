import { ScoreOption, Rhythm, RestSimple, RestComplex, SingleSimple, SingleComplex, GroupSimple, GroupComplex, GNote, Tuplet, Comment, ParserMeasure, Pitch, isPitch } from "./types"
const P = require("parsimmon")

const word = P.takeWhile(input => {
  const notAllowed = [' ', '\n', '\r', '\t', '\r\n']
  return !notAllowed.includes(input)
})
  .desc("a word")

const spaces = P.alt(P.string(" "), P.string("\t"), P.string("\n"), P.string("\r"), P.string("\r\n")).many()
  .desc("spaces or newlines")
const regularSpace = P.alt(P.string(" "), P.string("\t"))
  .desc("a space")
const emptySpaces = regularSpace.many()
  .desc("empty spaces")
const emptySpaces1 = regularSpace.atLeast(1)
  .desc("empty spaces")
const spacesAndNewline = emptySpaces.skip(P.newline)
  .desc("spaces and a newline")
const emptyLines = spacesAndNewline.many()
  .desc("empty lines")

const restOfLine = P.takeWhile(input => {
  return (input !== '\n' && input !== '\r' && input !== '\r\n')
}).map(result => {
  return result.trim()
})


// *********** PARSE OPTIONS ***************

// After the '-', there needs to be a word followed
const optionWord = word.skip(emptySpaces1)
const optionIdentifier = P.string("-")
  .then(optionWord)
  .desc("a dash followed by an option descriptor")

const singleOption = P.seqMap(optionIdentifier, restOfLine, P.newline, function(option, value, newline) {
  const result: ScoreOption = {
    kind: "scoreOption",
    option,
    value
  }
  return result
})

const singleOptionBetweenMeasures = singleOption.skip(spaces)

const option = singleOption.many().skip(spaces)


// *********** PARSE MEASURES ***************

// pitches
const csharp = P.string("c#")
const cflat = P.string("cb")
const cnat = P.string("cn")
const dsharp = P.string("d#")
const dflat = P.string("db")
const dnat = P.string("dn")
const esharp = P.string("e#")
const eflat = P.string("eb")
const enat = P.string("en")
const fsharp = P.string("f#")
const fflat = P.string("fb")
const fnat = P.string("fn")
const gsharp = P.string("g#")
const gflat = P.string("gb")
const gnat = P.string("gn")
const asharp = P.string("a#")
const aflat = P.string("ab")
const anat = P.string("an")
const bsharp = P.string("b#")
const bflat = P.string("bb")
const bnat = P.string("bn")
const a = P.string("a")
const b = P.string("b")
const c = P.string("c")
const d = P.string("d")
const e = P.string("e")
const f = P.string("f")
const g = P.string("g")
const noPitch = P.string("x").map(x => "nopitch")

const pitch = P.alt(csharp, cflat, cnat, dsharp, dflat, dnat, esharp, eflat, enat, fsharp, fflat, fnat, gsharp, gflat, gnat, asharp, aflat, anat, bsharp, bflat, bnat, a, b, c, d, e, f, g, noPitch)
  .desc("one of the following valid pitches: a, a#, ab, an, b, b#, bb, bn, c, c#, cb, cn, d, d#, db, dn, e, e#, eb, en, f, f#, fb, fn, g, g#, gb, gn, x")

// Properties
const sls = P.string("sls")
const sle = P.string("sle")
const stu = P.string("stu")
const std = P.string("std")
const plu = P.string("plu")
const pld = P.string("pld")
const har = P.string("har")
const gra = P.string("gra")
const sld = P.string("sld")
const sli = P.string("sli")
const slu = P.string("slu")
const par = P.string("par")
const tie = P.string("tie")
const upf = P.string("^")
const ham = P.string("ham")
const plm = P.string("plm")
const pl1 = P.string("pl1")
const pl2 = P.string("pl2")

const slash = P.string("/")
const eitherProperty = slash.then(P.alt(par, sld, sli, slu, tie, har, upf, ham))
  .desc("one of the following properties: par, sld, sli, slu, tie, har, ^, ham")
const multiProperty = slash.then(P.alt(gra, stu, std, plu, pld, sls, sle, plm, pl1, pl2))
  .desc("one of the following properties: gra, stu, std, plu, pld, sls, sle, plm, pl1, pl2")
const eitherProperties = eitherProperty.many()
const multiProperties = multiProperty.many()
const anyProperty = slash.then(P.alt(par, sld, sli, slu, tie, har, upf, ham, gra, stu, std, plu, pld, sls, sle, plm, pl1, pl2))
  .desc("one of the following properties: par, sld, sli, slu, tie, har, ^, ham, gra, stu, std, plu, pld, sls, sle, plm, pl1, pl2")
const anyProperties = anyProperty.many()

// Rhythms
const x64 = P.string("64").map(Number)
const x32 = P.string("32").map(Number)
const x16 = P.string("16").map(Number)
const x8 = P.string("8").map(Number)
const x4 = P.string("4").map(Number)
const x2 = P.string("2").map(Number)
const x1 = P.string("1").map(Number)
const x0 = P.string("0").map(Number)

const dot = P.string(".").many().map(x => x.length)

const rhythmNumber = P.alt(x64, x32, x16, x8, x4, x2, x1, x0)
const rhythm = P.seqMap(rhythmNumber, dot, function(num, d) {
  const r : Rhythm = [num, d]
  return r
})
  .desc("one of the following rhythms: 0, 1, 2, 4, 8, 16, 32, 64, followed by up to 3 dots")


// measure number
const number = P.digits
const measureNumber = P.seqMap(number, P.string(":"), spacesAndNewline, function(n, c, s) {
  return n
})
  .desc("a measure number of the form <number>:")


// Rests
const restSimple = P.string("r")
  .map(r => {
    const x: RestSimple = {
      kind: "simple",
      simpleKind: "restSimple"
    }
    return x
  })

const restComplex = P.string("r")
  .then(rhythm)
  .map(rh => {
    const x: RestComplex = {
      kind: "complex",
      complexKind: "restComplex",
      rhythm: rh
    }
    return x
  })

const anyRest = P.alt(restComplex, restSimple)
  .desc("a rest of the form r or r<rhythm>")



// *** Single notes

// Only allow strings 1-6
const stringNum = P.test(c => {
  return ["1", "2", "3", "4", "5", "6"].includes(c)
})
  .map(Number)
  .desc("1, 2, 3, 4, 5 or 6 to indicate which string of the guitar")


const singleSimple = P.seqMap(stringNum, pitch, anyProperties, (str, p, props) => {
  const x : SingleSimple = {
    kind: "simple",
    simpleKind: "singleSimple",
    string: str,
    pitch: p,
    properties: props
  }
  return x
})

const singleComplex = P.seqMap(stringNum, pitch, rhythm, anyProperties, (str, p, r, props) => {
  const x : SingleComplex = {
    kind: "complex",
    complexKind: "singleComplex",
    string: str,
    rhythm: r,
    pitch: p,
    properties: props
  }
  return x
})

const singleNote = P.alt(singleComplex, singleSimple)


// *** Group notes
const gNote = P.seqMap(stringNum, pitch, eitherProperties, (str, p, eProps) => {
  const x : GNote = {
    string: str,
    pitch: p,
    eitherProperties: eProps
  }
  return x
})

const multipleNotes = gNote.sepBy1(emptySpaces1)

const notesWithParens = multipleNotes
  .trim(emptySpaces)
  .wrap(P.string("("), P.string(")"))

const groupSimple = P.seqMap(notesWithParens, multiProperties, (notes, mProps) => {
  const x : GroupSimple = {
    kind: "group",
    groupKind: "groupSimple",
    notes: notes,
    multiProperties: mProps
  }
  return x
})

const groupComplex = P.seqMap(notesWithParens, rhythm, multiProperties, (notes, r, mProps) => {
  const x : GroupComplex = {
    kind: "group",
    groupKind: "groupComplex",
    rhythm: r,
    notes: notes,
    multiProperties: mProps
  }
  return x
})

const group = P.alt(groupComplex, groupSimple)

// *** Tuplets
const tupletNote = P.alt(anyRest, group, singleNote)

const tupletNotes = tupletNote.sepBy1(emptySpaces1)

const tupletBody = tupletNotes
  .trim(emptySpaces)
  .wrap(P.string("<"), P.string(">"))

// A tuplet can be a grace note, but that's the ONLY property allowed after the rhythm
const graceOnly = P.string("/gra")
  .fallback("")

const tuplet = P.seqMap(tupletBody, rhythm, graceOnly, (t, r, g) => {
  const x: Tuplet = {
    kind: "tuplet",
    notes: t,
    rhythm: r,
    grace: g ? true : false
  }
  return x
})


// *** Comment
const comment = P.string("$")
  .then(P.takeWhile(c => {
    const p = ["$", "\r", "\n", "\r\n"]
    return !p.includes(c)
  }))
  .skip(P.string("$"))
  .map(cm => {
    const x : Comment = {
      kind: "comment",
      comment: cm
    }
    return x
  })

const hiddenComment = P.string("%")
  .skip(P.takeWhile(c => {
    const p = ["%", "\r", "\n", "\r\n"]
    return !p.includes(c)
  }))
  .skip(P.string("%"))


const hiddenCommentEmptyLines = P.string("%")
  .skip(P.takeWhile(c => {
    const p = ["%", "\r", "\n", "\r\n"]
    return !p.includes(c)
  }))
  .skip(P.string("%"))
  .skip(emptyLines)




// *********** Notes and measures
const note = emptySpaces1
  .then(P.alt(comment, hiddenComment, tuplet, anyRest, group, singleNote))
  .skip(emptyLines)

const multipleNotesInMeasure = note.atLeast(1)

const measure = hiddenCommentEmptyLines
  .atMost(1)
  .then(P.seqMap(measureNumber, multipleNotesInMeasure, spaces, (num, notes, spaces) => {
    // get rid of hidden comments
    const notesNoHiddenComments = notes.filter(n => n !== "%")
    const x : ParserMeasure = {
      kind: "parserMeasure",
      measureNumber: num,
      notes: notesNoHiddenComments
    }
    return x
  }))


// ******** EXPR

// Allow for single options to be placed between measures. These would be key, time, capo changes
const measureOrOption = P.alt(measure, singleOptionBetweenMeasures).many()


const expr = P.seqMap(option, measureOrOption, spaces, (o, m, s) => {
  return [o, m]
})

export const grammar = expr.skip(P.eof)
