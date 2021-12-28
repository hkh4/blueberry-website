import { RhythmNumber, ParserMeasure, ParserNote, OptionsRecord, Measure, Expr, Element, TimeChange, Simple, Property, MultiProperty, EitherProperty, isMulti, isEither, NormalGuitarNote, X, SingleNote } from "./types"
import { evalInnerOption } from "./options"
import { bufferElement, emptyElement, barlineElement, emptyElementWidth, timeChangeWidth } from "./constants"



/* Given a list of properties, divide them into EitherProperties and MultiProperties
1. props: list of all properties to be divded
RETURNS list of EitherProperties, list of MultiProperties
*/
function divideProperties(props: Property[]) : [EitherProperty[], MultiProperty[]] {

  let e : EitherProperty[] = []
  let m : MultiProperty[] = []

  props.forEach(p => {
    if (isMulti(p)) {
      m.push(p)
    } else {
      e.push(p)
    }
  })

  // remove duplicates
  const eProps = Array.from(new Set(e))
  const mProps = Array.from(new Set(m))

  return [eProps, mProps]

}




/* Parse a simple note or rest
1. measureNumber
2. note: the simple note being parsed
3. baseBeat: bottom number of time signature
4. numberOfBeats: top number of time signature
5. nextStart: what beat this note starts on in the measure
6. last: is it the last note in the measure?
7. optionsR: OptionsRecord with options information
8. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the new element, and whether or not it's a grace note
*/
function parseSimple(measureNumber: number, note: Simple, baseBeat: RhythmNumber, numberOfBeats: number, nextStart: number, last: boolean, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element, boolean] {

  switch (note.simpleKind) {

    case "singleSimple":

      // Divide the properties
      const [eProps, mProps] = divideProperties(note.properties)

      // Create the NoteInfo, based on if it should be an X note or a NormalGuitarNote
      let notePortion : Note;

      if (note.pitch === "nopitch") {
        
      } else {

      }

      break;

    case "restSimple":
  }

  return [bufferElement, false] //TEMP

}




/* Evaluate a note
1. measureNumber
2. note: the note being evaluated. It shouldn't be a comment.
3. baseBeat: bottom number of time signature
4. numberOfBeats: top number of time signature
5. nextStart: what beat this note starts on in the measure
6. last: is it the last note in the measure?
7. optionsR: OptionsRecord with options information
8. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the new element, its width, and whether or not it's a grace note
*/
function evalNote(measureNumber: number, note: ParserNote, baseBeat: RhythmNumber, numberOfBeats: number, nextStart: number, last: boolean, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element, number, boolean] {

  let element : Element;
  let isGrace : boolean;

  switch (note.kind) {

    case "simple":

      [element, isGrace] = parseSimple(measureNumber, note, baseBeat, numberOfBeats, nextStart, last, optionsR, defaultRhythm)

      break;
    // case "complex":
    //   break;
    // case "group":
    //   break;
    // case "tuplet":
    //   break;
    default:
      throw new Error("Internal error in evalNote. Switch reached a comment or hiddencomment, shouldn't happen.")

  }



  return [bufferElement, 0.0, false]

}




/* Helper for evaluating a measure
1. measureNumber
2. notes: the ParserNote list for this measure
3. notesWithoutComments: same as notes but without any comment elements
4. baseBeat: bottom number of time signature
5. numberOfBeats: top number of time signature
6. optionsR: options info for this measure
7. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the list of new Elements, and the total width of all the Elements
*/
function evalMeasureHelper(measureNumber: number, notes: ParserNote[], notesWithoutComments: ParserNote[], baseBeat: RhythmNumber, numberOfBeats: number, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element[], number] {

  // The final list of elements to be returned, once evaluated
  let elements : Element[] = []

  // Holds all grace notes that are to be appended to a future note
  let graceBefore : Element[] = []

  // Which beat the current note falls on
  let nextStart = 0.0

  // Total width of all elements in the measure
  let totalWidth = 0.0

  // Temp value for destructuring
  let isGrace = false

  // keep track of how many real notes have been encountered, so we know if it's the last note or not
  let realNoteCount = 1
  const numberOfRealNotes = notesWithoutComments.length

  for (let i = 0; i < notes.length; i++) {

    const note = notes[i]

    let newNote : Element;

    // First, check if this note is a comment
    if (note.kind === "comment") {

      // Make sure that some note has already been parsed, since a comment can only come after a note
      if (elements.length < 1) {
        throw new Error(`Error in measure ${measureNumber}! A comment cannot come before the first note of a measure!`)
      }

      // Add the comment to the last note
      elements[elements.length - 1].comments = note.comment

      // This isn't a note, so no need to go through the rest of this function
      continue;

    }

    // if it's the last note
    if (realNoteCount === numberOfRealNotes) {

      [newNote, nextStart, isGrace] = evalNote(measureNumber, note, baseBeat, numberOfBeats, nextStart, true, optionsR, defaultRhythm)

    } else {
      // not the last note
      [newNote, nextStart, isGrace] = evalNote(measureNumber, note, baseBeat, numberOfBeats, nextStart, false, optionsR, defaultRhythm)
    }

    // increment how many notes have been seen
    realNoteCount += 1

    if (isGrace) {
      // If it's a grace note, add it to graceBefore
      graceBefore.push(newNote)

    } else {
      // If it's not a grace note, add the graceBefore list to the grace notes of the returned note. Set graceBefore to be empty
      newNote.graceNotes = graceBefore
      graceBefore = []

      elements.push(newNote)

    }

    // add the width of the returned note
    totalWidth += newNote.width

  }

  return [elements, totalWidth]

}




/* Evaluates one measure
1. m: ParserMeasure to be evaluated
2. optionsR: contains options information that will be incorporated into the Measure
3. changes: whether there are time, key, or capo changes. Form is { key: boolean, time: boolean, capo: boolean }
4. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the new Measure
*/
function evalMeasure(m: ParserMeasure, optionsR: OptionsRecord, changes, defaultRhythm: [RhythmNumber, number]) : Measure {

  const notes = m.notes
  const measureNumber = m.measureNumber
  const [numberOfBeats, baseBeat] = optionsR.time

  // First, create a version with no comments. It will be used later when we need to see if a note is the last note of the measure
  const notesWithoutComments = notes.filter(n => n.kind !== "comment")

  // Call the helper. Returns the new elements, and the total width of the measure
  let [elements, width] = evalMeasureHelper(measureNumber, notes, notesWithoutComments, baseBeat, numberOfBeats, optionsR, defaultRhythm)

  // Add empty space at the beginning
  elements.unshift(emptyElement)

  // Add barline at the end
  elements.push(barlineElement)

  // Add the empty element's width
  width += emptyElementWidth

  // If there's a time change, add that
  if (changes.time) {

    const timeChange : TimeChange = {
      kind: "timeChange",
      newTime: optionsR.time
    }

    const timeChangeElement : Element = {
      noteInfo: timeChange,
      duration: "norhythm",
      start: 0.0,
      width: timeChangeWidth,
      lastNote: false,
      location: [0.0, 0.0],
      graceNotes: [],
      comments: ""
    }

    elements.unshift(timeChangeElement)

  }

  const measure : Measure = {
    key: optionsR.key,
    time: optionsR.time,
    capo: optionsR.capo,
    measureNumber: measureNumber,
    elements: elements,
    width: width,
    changes: changes
  }

  return measure

}



/* Goes through the ParserMeasures one by one, and turns them into Measures, with all the required information for the measure
1. parserMeasures: list of ParserMeasure
2. optionsR: OptionsRecord with all the options information
3. defaultRhythm: for notes that don't have rhythms
returns the list of parsed Measures
*/
export function evalMeasures(elements: Expr[], optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : Measure[] {

  let measures : Measure[] = []

  let changes = {
    time: false,
    key: false,
    capo: false
  }

  // For user debugging
  let lastMeasureNumber = 0

  elements.forEach(p => {

    switch (p.kind) {
      case "scoreOption":

        // Call evalOptions to update the optionsR. The info is then saved for use for the measures that come after
        const [newOptionsR, kind] = evalInnerOption(p, optionsR, lastMeasureNumber)

        optionsR = newOptionsR
        changes[kind] = true

        break;

      case "parserMeasure":

        // Call the helper
        const newMeasure = evalMeasure(p, optionsR, changes, defaultRhythm)

        measures.push(newMeasure)
        changes = {
          time: false,
          key: false,
          capo: false
        }
        lastMeasureNumber = p.measureNumber
        break;

      default:
        throw new Error("Internal error in divide: evalMeasures")
    }

  })

  return measures

}
