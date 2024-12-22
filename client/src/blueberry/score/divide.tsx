import { RhythmNumber, ParserMeasure, ParserNote, OptionsRecord, Measure, Line, Page, Expr, Element, TimeChange, Group, GNote, GroupNote, Simple, SingleSimple, SingleComplex, Complex, Property, MultiProperty, EitherProperty, isMulti, SingleNote, Note, Notehead, GuitarString, Ints, Pitch, Key, Rest, Rhythm, isRhythmNumberNumber, Tuplet, TupletNote, isInts, AllVariables } from "./types"
import { evalInnerOption } from "./options"
import { bufferElement, emptyElement, barlineElement, emptyElementWidth, timeChangeWidth, keyChange, widths, graceWidths, arrayOfRhythms, minimumLastWidth, tupletWidthReduction, firstLineWidth, otherLinesWidth, firstPageLineStart, otherPagesLineStart, lastPossibleLineStart, heightBetweenLines, firstLineX, otherLinesX, emptyMeasure, emptyMeasureWidth } from "./constants"



/* Given a list of properties, divide them into EitherProperties and MultiProperties
1. props: list of all properties to be divded
RETURNS list of EitherProperties, list of MultiProperties
*/
export function divideProperties(props: Property[]) : [EitherProperty[], MultiProperty[]] {

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




/* Change the pitch based on the key
1. pitch: written pitch of the note
2. key: key for this note
RETURNS new pitch
*/
function parseKey(pitch: Pitch, key: Key) : Pitch {

  // First, get the right part of the key change object
  const keyObj = keyChange[key]

  // See if the pitch needs to be changed
  if (keyObj[pitch]) {
    return keyObj[pitch]
  } else {
    return pitch
  }

}





/* Calculate what fret a certain note should be on
1. guitarString: what string is this note on
2. pitch: pitch of the note
3. capo: what the capo is currently set to
4. tuningNumbers: describes how the guitar is tuned
5. eProps: the EitherProperty list of this note. Used to check if there's an up fret or not
6. measureNumber: for errors
RETURNS the fret
*/
function calculateFret(guitarString: GuitarString, pitch: Pitch, capo: Ints, tuningNumbers: number[], eProps: EitherProperty[], measureNumber: number) : Ints {

  let fretByPitch : Ints;

  switch (pitch) {

    case "e":
    case "en":
    case "fb":
      fretByPitch = 0
      break;
    case "f":
    case "fn":
    case "e#":
      fretByPitch = 1
      break;
    case "f#":
    case "gb":
      fretByPitch = 2
      break;
    case "g":
    case "gn":
      fretByPitch = 3
      break;
    case "g#":
    case "ab":
      fretByPitch = 4
      break;
    case "a":
    case "an":
      fretByPitch = 5
      break;
    case "a#":
    case "bb":
      fretByPitch = 6
      break;
    case "b":
    case "bn":
    case "cb":
      fretByPitch = 7
      break;
    case "c":
    case "cn":
    case "b#":
      fretByPitch = 8
      break;
    case "c#":
    case "db":
      fretByPitch = 9
      break;
    case "d":
    case "dn":
      fretByPitch = 10
      break;
    case "d#":
    case "eb":
      fretByPitch = 11
      break;
    default:
      throw new Error("Internal error in calculateFret. nopitch shouldn't show up here.")

  }

  // take the capo into account
  const fretByCapo = (fretByPitch + (12 - capo)) % 12

  // then, adjust based on which string it's on, and what the tuning is
  let fret = (fretByCapo + tuningNumbers[guitarString - 1]) % 12

  // If this note has the ^ property, add 12
  if (eProps.includes("^")) {
    fret += 12
  }

  if (!isInts(fret)) {
    throw new Error(`Error in measure ${measureNumber}! The maximum fret allowed in 30.`)
  }

  return fret

}


 

/* Helper for parseSimple and parseComplex. Creates and returns a SingleNote
1. note: the note being parsed. Either a singlesimple or a singlecomplex
2. optionsR: optionsrecord with all options info
3. last: whether or not it's the last note in the measure
4. rhythm: if it's a simple note, this is the default rhythm. If it's a complex note, it's the rhythm given to the note
5. measureNumber: for debugging
RETURNS the new element, and if this note is a grace note
*/
function createSingleNote(note: SingleSimple | SingleComplex, optionsR: OptionsRecord, last: boolean, rhythm: [RhythmNumber, number], measureNumber: number) : [Element, boolean] {

  let singleNote : SingleNote;

  // Divide the properties
  const [eProps, mProps] = divideProperties(note.properties)

  // Create the NoteInfo, based on if it should be an X note or a NormalGuitarNote
  let notePortion : Note;

  if (note.pitch === "nopitch") {

    // x note
    notePortion = {
      noteKind: "x",
      string: note.string,
      eitherProperties: eProps
    }

  } else {

    const newPitch = parseKey(note.pitch, optionsR.key)

    // normalguitarnote
    // Get the fret
    const fret = calculateFret(note.string, newPitch, optionsR.capo, optionsR.tuningNumbers, eProps, measureNumber)

    notePortion = {
      noteKind: "normalGuitarNote",
      string: note.string,
      pitch: newPitch,
      fret: fret,
      eitherProperties: eProps
    }

  }

  singleNote = {
    kind: "singleNote",
    note: notePortion,
    multiProperties: mProps
  }

  // Check to see if it's a grace note
  const isGrace : boolean = mProps.includes("gra")

  // If it's a grace note AND the last note, throw an error, since the last note of a measure cannot be a grace note
  if (isGrace && last) {
    throw new Error(`Error in measure ${measureNumber}! The last note of a measure can't be a grace note.`)
  }


  const element : Element = {
    noteInfo: singleNote,
    duration: rhythm,
    start: 0.0, // just a default temporary value
    width: 0.0,
    lastNote: last,
    location: [0.0, 0.0],
    graceNotes: [],
    comments: ""
  }

  return [element, isGrace]
}




/* Parse a simple note or rest
1. measureNumber
2. note: the simple note being parsed
3. last: is it the last note in the measure?
4. optionsR: OptionsRecord with options information
5. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the new element, and whether or not it's a grace note
*/
export function parseSimple(measureNumber: number, note: Simple, last: boolean, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element, boolean] {

  let isGrace : boolean;

  let element : Element;

  switch (note.simpleKind) {

    case "singleSimple":

      [element, isGrace] = createSingleNote(note, optionsR, last, defaultRhythm, measureNumber)

      break;

    case "restSimple":

      const rest : Rest = {
        kind: "rest"
      }

      element = {
        noteInfo: rest,
        duration: defaultRhythm,
        start: 0.0,
        width: 0.0,
        lastNote: last,
        location: [0.0, 0.0],
        graceNotes: [],
        comments: ""
      }

      isGrace = false

      break;

  }

  return [element, isGrace] 

}




/* Parse a complex note
1. measureNumber
2. note: the complex note being parsed
3. last: is it the last note in the measure?
4. optionsR: OptionsRecord with options information
RETURNS the new element, whether or not it's a grace note, and the new default rhythm
*/
export function parseComplex(measureNumber: number, note: Complex, last: boolean, optionsR: OptionsRecord) : [Element, boolean, [RhythmNumber, number]] {

  let isGrace : boolean;

  let element : Element;

  const rhythm : Rhythm = note.rhythm

  // type checking
  if (!isRhythmNumberNumber(rhythm)) {
    throw new Error("Internal error in parseComplex. A complex note cannot have a rhythm of norhythm")
  }

  switch (note.complexKind) {

    case "singleComplex":

      [element, isGrace] = createSingleNote(note, optionsR, last, rhythm, measureNumber)

      break;

    case "restComplex":

      const rest : Rest = {
        kind: "rest"
      }

      element = {
        noteInfo: rest,
        duration: note.rhythm,
        start: 0.0,
        width: 0.0,
        lastNote: last,
        location: [0.0, 0.0],
        graceNotes: [],
        comments: ""
      }

      isGrace = false

      break;

  }

  let newDefaultRhythm : [RhythmNumber, number] = rhythm

  return [element, isGrace, newDefaultRhythm]

}






/* Parse a group note
1. measureNumber
2. note: the group note being parsed
3. last: is it the last note in the measure?
4. optionsR: OptionsRecord with options information
5. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the new element, whether or not it's a grace note, and the new default rhythm
*/
export function parseGroup(measureNumber: number, note: Group, last: boolean, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element, boolean, [RhythmNumber, number]] {

  // Destructure
  const { groupKind, notes, multiProperties } = note

  // Check to see if this note is a grace note
  const isGrace : boolean = multiProperties.includes("gra")

  // If it's a grace note AND the last note, throw an error, since the last note of a measure cannot be a grace note
  if (isGrace && last) {
    throw new Error(`Error in measure ${measureNumber}! The last note of a measure can't be a grace note.`)
  }

  // Keep track of which strings have a note. There can't be two notes on the same string
  let stringsUsed : GuitarString[] = []

  // Create the Note list
  let noteList : Note[] = notes.map((n : GNote) => {

    // Make sure this isn't a duplicate string
    if (stringsUsed.includes(n.string)) {
      throw new Error(`Error in measure ${measureNumber}! A group note can't have multiple notes on the same string.`)
    }

    stringsUsed.push(n.string)

    let notePortion : Note;

    if (n.pitch === "nopitch") {

      // x note
      notePortion = {
        noteKind: "x",
        string: n.string,
        eitherProperties: n.eitherProperties
      }
    } else {

      const newPitch = parseKey(n.pitch, optionsR.key)

      // normalguitarnote
      // Get the fret
      const fret = calculateFret(n.string, newPitch, optionsR.capo, optionsR.tuningNumbers, n.eitherProperties, measureNumber)

      notePortion = {
        noteKind: "normalGuitarNote",
        string: n.string,
        pitch: newPitch,
        fret: fret,
        eitherProperties: n.eitherProperties
      }

    }

    return notePortion

  })

  // Create the GroupNote
  let groupNote : GroupNote = {
    kind: "groupNote",
    notes: noteList,
    multiProperties: multiProperties
  }

  // Update the defaultRhythm if needed
  let newDefaultRhythm : [RhythmNumber, number];

  if (groupKind === "groupComplex") {
    // type checking
    if (!isRhythmNumberNumber(note.rhythm)) {
      throw new Error("Internal error in parseGroup. A complex note cannot have a rhythm of norhythm")
    }
    newDefaultRhythm = note.rhythm
  } else {
    newDefaultRhythm = defaultRhythm
  }


  // Create the element
  let element : Element = {
    noteInfo: groupNote,
    duration: newDefaultRhythm,
    start: 0.0,
    width: 0.0,
    lastNote: last,
    location: [0.0, 0.0],
    graceNotes: [],
    comments: ""
  }

  return [element, isGrace, newDefaultRhythm]

}




/* Parse a tuplet
1. measureNumber
2. note: the tuplet note being parsed
3. last: is it the last note in the measure?
4. optionsR: OptionsRecord with options information
5. defaultRhythm: rhythm to be used if none is given
RETURNS the new element, whether or not it's a grace note, and the new default rhythm
// */
export function parseTuplet(measureNumber: number, note: Tuplet, last: boolean, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element, boolean, [RhythmNumber, number]] {

  // Destructure the elements
  const { notes: tupletNotes, rhythm: tupletRhythm, grace: isGraceTuplet } = note

  let innerElements : Element[] = []

  // If the entire tuplet isn't a grace note, there could be grace notes within
  let innerGraceNotes : Element[] = []

  // Keep track of the total width of all notes
  let totalWidth = 0.0

  // Parse each individual note within the tuplet
  tupletNotes.forEach((n, index) => {

    let element : Element
    let isGrace : boolean = false

    switch (n.kind) {

      case "simple":

        [element, isGrace] = parseSimple(measureNumber, n, false, optionsR, defaultRhythm)

        break;

      case "complex":

        [element, isGrace, defaultRhythm] = parseComplex(measureNumber, n, false, optionsR)

        break;

      case "group":

        [element, isGrace, defaultRhythm] = parseGroup(measureNumber, n, false, optionsR, defaultRhythm)

        break;

      case "tuplet":
        throw new Error(`Error in measure ${measureNumber}! Can't have a tuplet within a tuplet.`)
      default:
        throw new Error("Internal error in parseTuplet. Switch reached a comment or hiddencomment, shouldn't happen.")
    }

    // If the entire tuplet is a grace note, and this inner note is a grace note, throw an error
    if (isGraceTuplet && isGrace) {
      throw new Error(`Error in measure ${measureNumber}! Can't have a grace note within a tuplet grace note.`)
    }

    // If this is the first note, it can't be a grace note
    if (isGrace && (index === 0)) {
      throw new Error(`Error in measure ${measureNumber}! The first note of a tuplet can't be a grace note. If you want a grace note attached to the first not of a tuplet, create it before the tuplet itself.`)
    }


    const rhythm = element.duration
    // Duration cannot be norhythm
    if (rhythm === "norhythm") {
      throw new Error("Internal error in parseTuplet. None of these notes should have a duration of 'norhythm'")
    }

    const [rhythmNumber, dots] = rhythm

    // Can't have any 0 rhythm notes within a tuplet. Doesn't make any sense.
    if (rhythmNumber === 0) {
      throw new Error(`Error in measure ${measureNumber}! No notes within a tuplet can have a rhythm of 0.`)
    }

    // Check dots
    checkDots(rhythmNumber, dots, measureNumber)

    // Get the width
    let width : number;

    const stringVersion = rhythm.toString()

    if (isGrace || isGraceTuplet) {
      width = graceWidths[stringVersion]
    } else {
      width = widths[stringVersion]

      // since we're in a tuplet, make the width a little smaller
      width /= tupletWidthReduction
    }


    // If this note isn't a grace note, and there are grace notes in innerGraceNotes, they need to be added, along with their widths
    if (!isGrace && (innerGraceNotes.length > 0)) {

      // Add up the widths of all the grace notes
      const graceWidths = innerGraceNotes.reduce((prev, current) => {
        return prev + current.width
      }, 0.0)

      width += graceWidths

      // add the grace notes to the element, along with the buffer
      innerGraceNotes.push(bufferElement)

      element.graceNotes = innerGraceNotes
      innerGraceNotes = []

    }

    // If this is the last note, make sure the last note of the tuplet is at least the minimum width
    if (last && (index === tupletNotes.length - 1) && (width < minimumLastWidth)) {
      width = minimumLastWidth
    }

    // Add the width to total ONLY if it isn't a grace note. This avoids double counting
    if (!isGrace) {
      totalWidth += width
    }

    // Add the width
    element.width = width

    // If it is a grace note, add it to the grace list. Otherwise, add it to the element list
    if (isGrace) {
      innerGraceNotes.push(element)
    } else {
      innerElements.push(element)
    }

  })

  // Make sure that innerGraceNotes is empty.
  if (innerGraceNotes.length > 0) {
    throw new Error(`Error in measure ${measureNumber}! The last note of a tuplet can't be a grace note.`)
  }

  // Create the TupletNote and Element
  const tupletNote : TupletNote = {
    kind: "tupletNote",
    notes: innerElements
  }

  const tupletElement : Element = {
    noteInfo: tupletNote,
    duration: tupletRhythm,
    start: 0.0,
    width: totalWidth,
    lastNote: last,
    location: [0.0,0.0],
    graceNotes: [],
    comments: ""
  }

  // set the new default rhythm
  if (!isRhythmNumberNumber(tupletRhythm)) {
    throw new Error("Internal error in parseTuplet. A complex note cannot have a rhythm of norhythm")
  }

  const newDefaultRhythm : [RhythmNumber, number] = tupletRhythm

  console.log([tupletElement, isGraceTuplet, newDefaultRhythm])

  return [tupletElement, isGraceTuplet, newDefaultRhythm]

}





/* Calculate the width of a note, and how much rhythm space it takes
NOTE: the width of a tuplet note is taken care of separately.
1. element: the note
2. nextStart: the starting beat for this note
3. baseBeat: bottom number of time signature
4. numberOfBeats: top number of time signature
5. isGrace: whether or not this note is a grace note
RETURNS the updated element, and the new start for the next note
*/
function widthStart(element: Element, nextStart: number, baseBeat: RhythmNumber, numberOfBeats: number, isGrace: boolean) : [Element, number] {


  // First, get the rhythm out of the element and make sure it's no a "norhythm"
  const rhythm = element.duration
  if (rhythm === "norhythm") {
    throw new Error("Internal error in widthStart. None of these notes should have a duration of 'norhythm'")
  }

  const [rhythmNumber, dots] = rhythm

  // Figure out how many beats this note's rhythm takes, based on the time signature
  const indexOfBeat = arrayOfRhythms.indexOf(baseBeat)
  const indexOfRhythm = arrayOfRhythms.indexOf(rhythmNumber)

  /* Calculate how many beats. Find the difference in indexes between the two. Then, raise 2 to this power
  e.g. if the baseBeat is 4 and the rhythm is 8, it should be half a beat. The index of 4 is 2, the index of 8 is 3
  2-3 = -1. 2^-1 = 1/2!
  */
  const diff = indexOfBeat - indexOfRhythm
  let totalRhythm = Math.pow(2, diff)

  // If there are dots, change the rhythm
  switch (dots) {
    case 1:
      totalRhythm *= 1.5
      break;
    case 2:
      totalRhythm *= 1.75
      break;
    case 3:
      totalRhythm *= 1.875
      break;
  }

  const newNextStart = totalRhythm + nextStart

  // If it's a tuplet note, the width was already taken care of
  if (element.noteInfo.kind === "tupletNote") {

    const noteInfo : TupletNote = element.noteInfo

    // if it's a grace note, don't update nextStart. Otherwise, do update
    if (isGrace) {
      return [element, nextStart]
    }

    // update start for the whole tuplet, and for each element in the tuplet

    let newNotes: Element[] = []

    noteInfo.notes.forEach(n => {
      const newNote : Element = {
        ...n,
        start: nextStart
      }
      newNotes.push(newNote)
    })

    let newNoteInfo : Notehead = {
      kind: "tupletNote",
      notes: newNotes
    }

    let newElement : Element = {
      ...element,
      start: nextStart,
      noteInfo: newNoteInfo
    }

    return [newElement, newNextStart]

  }

  // Take care of the grace note case first
  if (isGrace) {
    const stringVersion = rhythm.toString()
    const width = graceWidths[stringVersion]

    // Just find the width and return, the start doesn't matter for grace notes
    let newElement : Element = {
      ...element,
      width: width
    }

    return [newElement, nextStart]
  }

  // Take care of the 0 rhythm first
  if (rhythmNumber === 0) {

    const width = widths['0,0']

    let newElement : Element = {
      ...element,
      width: width
    }

    return [newElement, numberOfBeats + 1]

  }

  // Get the width
  const stringVersion = rhythm.toString()
  let width = widths[stringVersion]

  // If this is the last note, make sure the width meets the minimum
  if (element.lastNote && width < minimumLastWidth) {
    width = minimumLastWidth
  }

  // New element
  const newElement : Element = {
    ...element,
    width: width,
    start: nextStart
  }

  return [newElement, newNextStart]

}




/* Helper to make sure a note has the proper number of dots
1. rhythm: the RhythmNumber of the rhythm
2. dots: number of dots
3. measureNumber
RETURNS nothing. Will throw an error if anything is wrong
*/
function checkDots(rhythm: RhythmNumber, dots: number, measureNumber: number) {
  switch (rhythm) {
    case 0:
      if (dots > 0) throw new Error(`Error in measure ${measureNumber}! A rest with rhythm 0 cannot have dots.`)
      break;
    case 64:
      if (dots > 0) throw new Error(`Error in measure ${measureNumber}! A 64th note can't have dots.`)
      break;
    case 32:
      if (dots > 1) throw new Error(`Error in measure ${measureNumber}! A 32nd note can only have up to 1 dot.`)
      break;
    case 16:
      if (dots > 2) throw new Error(`Error in measure ${measureNumber}! A 16th note can only have up to 2 dots.`)
      break;
    case 8:
    case 4:
    case 2:
    case 1:
      if (dots > 3) throw new Error(`Error in measure ${measureNumber}! A note can have a maximum of 3 dots.`)
      break;
    default:
      throw new Error("Internal error in checkDots. Reached unreachable case in switch")
  }
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
RETURNS the new element, the new nextStart, whether or not it's a grace note, and the new default rhythm
*/
function evalNote(measureNumber: number, note: ParserNote, baseBeat: RhythmNumber, numberOfBeats: number, nextStart: number, last: boolean, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element, number, boolean, [RhythmNumber, number]] {

  let element : Element;
  let isGrace : boolean;

  // Parse the note
  switch (note.kind) {

    case "simple":

      [element, isGrace] = parseSimple(measureNumber, note, last, optionsR, defaultRhythm)

      break;
    case "complex":

      [element, isGrace, defaultRhythm] = parseComplex(measureNumber, note, last, optionsR)

      break;
    case "group":

      [element, isGrace, defaultRhythm] = parseGroup(measureNumber, note, last, optionsR, defaultRhythm)

      break;
    case "tuplet":

      [element, isGrace, defaultRhythm] = parseTuplet(measureNumber, note, last, optionsR, defaultRhythm)

      break;
    default:
      throw new Error("Internal error in evalNote. Switch reached a comment or hiddencomment, shouldn't happen.")

  }

  // Duration cannot be norhythm
  if (element.duration === "norhythm") {
    throw new Error("Internal error in evalNote. None of these notes should have a duration of 'norhythm'")
  }


  const [rhythm, dots] = element.duration

  // First, make sure that only a rest has a rhythm of 0
  if ((rhythm === 0) && (element.noteInfo.kind !== "rest")) {
    throw new Error(`Error in measure ${measureNumber}! Only a rest can have a rhythm of 0`)
  }

  // Call the helper to make sure rhythms are valid
  checkDots(rhythm, dots, measureNumber)

  // Call widthStart to figure out the width of the element, and how much time this note takes up in the measure.
  let newElement : Element;
  let newNextStart : number;


  [newElement, newNextStart] = widthStart(element, nextStart, baseBeat, numberOfBeats, isGrace)


  if (newElement.lastNote) {

    // If it's the last note, need to make sure the total rhythm is the right number
    if (newNextStart > (numberOfBeats + 1.0)) {
      throw new Error(`Error! Too many beats in measure ${measureNumber}`)

    } else if ((newNextStart < numberOfBeats + 1.0) && (measureNumber !== 0)) {

      // if there aren't enough beats AND it's not the first measure, error. First measure can have fewer because it can be a pick-up
      throw new Error(`Error! Not enough beats in measure ${measureNumber}`)
    }
  } else {

    // If it's not the last note, still make sure we aren't over the rhythm total
    if (newNextStart > (numberOfBeats + 1.0)) {
      throw new Error(`Error! Too many beats in measure ${measureNumber}`)
    }
  }

  return [newElement, newNextStart, isGrace, defaultRhythm]

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
function evalMeasureHelper(measureNumber: number, notes: ParserNote[], notesWithoutComments: ParserNote[], baseBeat: RhythmNumber, numberOfBeats: number, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : [Element[], number, [RhythmNumber, number]] {

  let newDefaultRhythm : [RhythmNumber, number] = defaultRhythm

  // The final list of elements to be returned, once evaluated
  let elements : Element[] = []

  // Holds all grace notes that are to be appended to a future note
  let graceBefore : Element[] = []

  // Which beat the current note falls on
  let nextStart = 1.0

  // Total width of all elements in the measure
  let totalWidth = 0.0

  // Temp value for destructuring
  let isGrace = false

  // keep track of how many real notes have been encountered, so we know if it's the last note or not
  let realNoteCount = 1
  const numberOfRealNotes = notesWithoutComments.length

  // if a comment was placed before a note, hold it here and attach it to the next note
  let commentHolder;
  let addExtraComment = false

  for (let i = 0; i < notes.length; i++) {

    const note = notes[i]

    let newNote : Element;

    // First, check if this note is a comment
    if (note.kind === "comment") {

      // If no note has been parsed yet, the comment will go onto the next note
      if (elements.length < 1) {
        commentHolder = note
        addExtraComment = true
        continue
      }

      // Add the comment to the last note
      elements[elements.length - 1].comments = note.comment

      // This isn't a note, so no need to go through the rest of this function
      continue;

    }

    // if it's the last note
    if (realNoteCount === numberOfRealNotes) {

      [newNote, nextStart, isGrace, newDefaultRhythm] = evalNote(measureNumber, note, baseBeat, numberOfBeats, nextStart, true, optionsR, newDefaultRhythm)

    } else {
      // not the last note
      [newNote, nextStart, isGrace, newDefaultRhythm] = evalNote(measureNumber, note, baseBeat, numberOfBeats, nextStart, false, optionsR, newDefaultRhythm)
    }

    // increment how many notes have been seen
    realNoteCount += 1

    if (isGrace) {
      // If it's a grace note, add it to graceBefore
      graceBefore.push(newNote)

    } else {
      // Take care of grace notes
      if (graceBefore.length > 0) {

        const kind = newNote.noteInfo.kind

        // if this note is a rest, throw an error, since rests can't have grace notes
        if (kind === "rest") {
          throw new Error(`Error in measure ${measureNumber}! Grace notes can't be added to a rest.`)

        } else {

          // add the widths of all the grace notes to the width of this note
          const graceWidths = graceBefore.reduce((prev, current) => {
            return prev + current.width
          }, 0.0)

          const totalWidth = newNote.width + graceWidths

          newNote.width = totalWidth

          // Add the buffer element
          graceBefore.push(bufferElement)

          // If the note is a tuplet, add the gracenotes to the first note of the tuplet
          if (kind === "tupletNote") {

            newNote.noteInfo.notes[0].graceNotes = graceBefore

            // also add the width to the first note
            newNote.noteInfo.notes[0].width += graceWidths

          } else if (kind === "singleNote" || kind === "groupNote") {
            // if it's any kind of note, just add the grace notes normally
            newNote.graceNotes = graceBefore

          } else {
            throw new Error("Internal error in evalMeasureHelper. Grace notes can only precede a tupletNote, singleNote, or groupNote")
          }

          // empty the list for the next note
          graceBefore = []

        }

      }

      // if an extra comment needs to be added to the first note
      if (addExtraComment) {
        newNote.comments = commentHolder.comment
        addExtraComment = false
      }

      elements.push(newNote)

      // add the width of the returned note, ONLY if it's not a grace note, so there's no double counting
      totalWidth += newNote.width

    }

  }

  return [elements, totalWidth, newDefaultRhythm]

}




/* Evaluates one measure
1. m: ParserMeasure to be evaluated
2. optionsR: contains options information that will be incorporated into the Measure
3. variables: AllVariables object containing all variables with keys and replacements
4. changes: whether there are time, key, or capo changes. Form is { key: boolean, time: boolean, capo: boolean }
5. defaultRhythm: rhythm to be used if none is given on a note
RETURNS the new Measure
*/
export function evalMeasure(m: ParserMeasure, optionsR: OptionsRecord, variables: AllVariables, changes, defaultRhythm: [RhythmNumber, number]) : [Measure, [RhythmNumber, number]] {

  let originalNotes = m.notes
  const measureNumber = m.measureNumber
  const [numberOfBeats, baseBeat] = optionsR.time
  let newDefaultRhythm : [RhythmNumber, number] = defaultRhythm

  // First, replace all UseVariable notes with their replacements
  let notes : ParserNote[] = []
  for (const note of originalNotes) {
    
    if (note.kind === "variable") {
      // get replacement
      const replacement = variables[note.key]
      notes.push(...replacement)
    } else {
      notes.push(note)
    }
  }

  // First, create a version with no comments. It will be used later when we need to see if a note is the last note of the measure
  const notesWithoutComments = notes.filter(n => n.kind !== "comment")

  // Call the helper. Returns the new elements, and the total width of the measure
  let elements : Element[]
  let width : number
  [elements, width, newDefaultRhythm] = evalMeasureHelper(measureNumber, notes, notesWithoutComments, baseBeat, numberOfBeats, optionsR, newDefaultRhythm)

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
    width += timeChangeWidth

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

  return [measure, newDefaultRhythm]

}



/* Goes through the ParserMeasures one by one, and turns them into Measures, with all the required information for the measure
1. parserMeasures: list of ParserMeasure
2. variables: AllVariables object containing all variables with keys and replacements
3. optionsR: OptionsRecord with all the options information
4. defaultRhythm: for notes that don't have rhythms
returns the list of parsed Measures
*/
export function evalMeasures(elements: Expr[], variables: AllVariables, optionsR: OptionsRecord, defaultRhythm: [RhythmNumber, number]) : Measure[] {

  let measures : Measure[] = []
  let newDefaultRhythm : [RhythmNumber, number] = defaultRhythm

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
        let newMeasure : Measure
        [newMeasure, newDefaultRhythm] = evalMeasure(p, optionsR, variables, changes, newDefaultRhythm)

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




/* Add extra empty measures to a line if needed
1. line: the line to be considered
RETURNS the updated line
*/
function addEmptyMeasures(line: Line) : Line {

  const diff = line.originalWidth / line.finalWidth

  if (diff < 0.25) {

    // if less than 25% full, add 5 empty measures
    line.measures.push(emptyMeasure,emptyMeasure,emptyMeasure,emptyMeasure,emptyMeasure)
    line.originalWidth += (emptyMeasureWidth * 5)

  } else if (diff < 0.5) {

    // if 25-50% full, add 3 empty measures
    line.measures.push(emptyMeasure,emptyMeasure,emptyMeasure)
    line.originalWidth += (emptyMeasureWidth * 3)

  } else if (diff < 0.75) {

    // if 50%-75% full, add one empty measure
    line.measures.push(emptyMeasure)
    line.originalWidth += emptyMeasureWidth

  }

  return line

}




/* Divide the measures into lines
1. measures: list of measures to be divided into lines
RETURNS the lines
*/
export function divideLines(measures: Measure[]) : Line[] {

  let lines : Line[] = []

  // is this the first line, for width purposes
  let firstLine = true;

  // keep track of the width of all measures so far
  let totalWidth = 0.0

  // keep track of all the measures that are to be added to the current line
  let measuresInCurrentLine : Measure[] = []

  measures.forEach(m => {

    // Add this measure's width
    totalWidth += m.width

    // See if it overflows the line. If so, end the line and start a new one
    const widthToCompare = firstLine ? firstLineWidth : otherLinesWidth

    if (totalWidth > widthToCompare) {

      // Create the new line
      const newLine : Line = {
        lineNumber: lines.length + 1,
        measures: measuresInCurrentLine,
        originalWidth: totalWidth - m.width,
        finalWidth: widthToCompare,
        start: [0.0,0.0] // to be figured out with pages are divided
      }

      const lineWithEmptyMeasures = addEmptyMeasures(newLine)

      lines.push(lineWithEmptyMeasures)

      measuresInCurrentLine = [m]
      totalWidth = m.width
      firstLine = false

    } else {

      // Add this measure to the list
      measuresInCurrentLine.push(m)

    }

  })

  // If there's anything left in measuresInCurrentLine, we need one last line
  if (measuresInCurrentLine.length > 0) {

    // need to figure out width of this line
    const w = measuresInCurrentLine.reduce((prev, current) => {
      return prev + current.width
    }, 0.0)

    const widthToCompare = firstLine ? firstLineWidth : otherLinesWidth

    const newLine : Line = {
      lineNumber: lines.length + 1,
      measures: measuresInCurrentLine,
      originalWidth: w,
      finalWidth: widthToCompare,
      start: [0.0,0.0] // to be figured out with pages are divided
    }

    const lineWithEmptyMeasures = addEmptyMeasures(newLine)

    lines.push(lineWithEmptyMeasures)
  }

  return lines

}




/* Divide lines into pages
1. lines: the lines to be divided
RETURNS list of pages
*/
export function dividePages(lines: Line[]) : Page[] {

  let pages : Page[] = []

  // What height are we currently at
  let currentLocation = firstPageLineStart

  let linesInCurrentPage : Line[] = []

  lines.forEach((l, index) => {


    // Check to see if the height has passed the edge
    if (currentLocation > lastPossibleLineStart) {

      const newPage : Page = {
        pageNumber: pages.length + 1,
        lines: linesInCurrentPage
      }

      pages.push(newPage)

      // update the line
      const newLine : Line = {
        ...l,
        start: [otherLinesX, otherPagesLineStart]
      }

      currentLocation = otherPagesLineStart + heightBetweenLines
      linesInCurrentPage = [newLine]

    } else {

      // Update the line
      const startX = (index === 0) ? firstLineX : otherLinesX

      const newLine : Line = {
        ...l,
        start: [startX, currentLocation]
      }

      linesInCurrentPage.push(newLine)

      // Move the location
      currentLocation += heightBetweenLines

    }

  })

  // If there is anything still in the list, that means there are extra lines left. Make one last page
  if (linesInCurrentPage.length > 0) {

    const newPage : Page = {
      pageNumber: pages.length + 1,
      lines: linesInCurrentPage
    }
    pages.push(newPage)
  }

  return pages

}





















//
