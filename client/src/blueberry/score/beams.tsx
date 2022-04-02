import { Element, Rhythm, RhythmNumber, GuitarString, isRhythmNumberNumber } from "./types"
import { Fragment, ReactElement } from "react"



/* Helper to beam a note
1. element to beam
2. lastLocation: x,y coordinates of the last element
3. lastRhythm: rhythm of the last element
4. lastLastRhythm: rhythm of the element before the last
5. lastStart: the starting beat of the last element
6. timeSignature of the measure
7. lastBeamed is 1 if the two previous notes were beamed and the same number of lines, 2 if the two previous notes were beamed but the first had more beams, 3 if the two previous notes were beamed but the second had more beams, and 0 else
8. isGrace: true if these notes are grace notes
9. guitarString: what string is this note on. Used for graphics
RETURNS code, new lastBeamed number
*/
function beamHelper(element: Element, lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeSignature: [number, RhythmNumber], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean, guitarString: GuitarString) : [ReactElement, 0 | 1 | 2 | 3] {

  // get info
  let dotNumber : number
  if (element.duration === "norhythm") {
    dotNumber = 0
  } else {
    dotNumber = element.duration[1]
  }

  // array for mapping
  let dotArray = Array.from(Array(dotNumber).keys())

  const [x,y] = element.location
  const [oldX, oldY] = lastLocation

  // draw the stem, depending on which string it's on and whether or not it's a grace note. If it's on string 6, the beam has to be a little shorter
  let stem : ReactElement = <>

    {
      isGrace ? (
        guitarString === 6 ? (
          <line className="beam-stem-grace" x1={x + 1.1} y1={y - 32.3} x2={x + 1.1} y2={y - 40} />
        ) : (
          <line className="beam-stem-grace" x1={x + 1.1} y1={y - 32} x2={x + 1.1} y2={y - 40} />
        )
      ) : (
        guitarString === 6 ? (
          <line className="beam-stem" x1={x + 1.5} y1={y - 33} x2={x + 1.5} y2={y - 42} />
        ) : (
          <line className="beam-stem" x1={x + 1.5} y1={y - 32} x2={x + 1.5} y2={y - 42} />
        )
      )
    }

  </>

  // draw the dots
  let dots : ReactElement = <>

    {
      isGrace ? (
        dotArray.map((n, index) => {
          return <Fragment key={index}>
            <circle cx={x + (1.4 * n) + 2.9} cy={y - 33} r="0.55" />
          </Fragment>
        })
      ) : (
        dotArray.map((n, index) => {
          return <Fragment key={index}>
            <circle cx={x + (1.7 * n) + 3.7} cy={y - 33.4} r="0.7" />
          </Fragment>
        })
      )
    }

  </>

  // TODO

  const result : ReactElement = <>
    {stem}
    {dots}
  </>

  return [result, 0]

}




/* Draw the bracket over a tuplet
1. notes: the elements of the tuplet
RETURNS code
*/
function drawTupletBracket(notes: Element[]) : ReactElement {

  // Get the locations
  const [x1, y1] = notes[0].location
  const [x2, y2] = notes[notes.length - 1].location

  // First, figure out the number for the bracket
  // Add up the rhythms of each note
  let total = 0.0

  notes.forEach(n => {

    const rhythm = n.duration

    // A note should not have a rhythm of "norhythm"
    if (!isRhythmNumberNumber(rhythm)) {
      throw new Error("Interal error in drawTupletBracket. A tuplet note shoudln't have a rhythm of 'norhythm'")
    }

    const [rNumber, dots] = rhythm

    let baseRhythm = 0

    switch (rNumber) {
      case 0:
        throw new Error("Internal error in drawTupletBracket. A tuplet note cannot have a rhythm of 0")
      case 1:
        baseRhythm = 4
        break;
      case 2:
        baseRhythm = 2
        break;
      case 4:
        baseRhythm = 1
        break;
      case 8:
        baseRhythm = 0.5
        break;
      case 16:
        baseRhythm = 0.25
        break;
      case 32:
        baseRhythm = 0.125
        break;
      case 64:
        baseRhythm = 0.0625
        break;
    }

    switch (dots) {
      case 0:
        break;
      case 1:
        baseRhythm *= 1.5
        break;
      case 2:
        baseRhythm *= 1.75
        break;
      case 3:
        baseRhythm *= 1.875
        break;
      default:
        throw new Error("Internal error in drawTupletBracket. A tuplet note cannot have a rhythm with more than 3 dots")
    }

    total += baseRhythm

  })

  // Next, multiply total by 16 to find out how many 64th notes there are
  let rhythmIn64 = total * 16

  // Figure out which number goes in the bracket
  let finalNumber = rhythmIn64

  while (true) {
    if (!Number.isInteger(finalNumber/2)) {
      break;
    } else {
      finalNumber /= 2
    }
  }

  let mid = ((x2 - x1) / 2) + x1 - 1
  let mid2 = mid + 4.5

  if (finalNumber > 9) {
    mid -= 2
    mid2 += 1
  }

  const code : ReactElement = <>
    <line className="tuplet-bracket" x1={x1 - 1} y1={y1 - 46} x2={x1 - 1} y2={y1 - 48} />
    <line className="tuplet-bracket" x1={x1 - 1.2} y1={y1 - 48} x2={mid} y2={y1 - 48} />
    <text className="tuplet-bracket-text" x={mid + 1} y={y1 - 47}>{finalNumber}</text>
    <line className="tuplet-bracket" x1={mid2} y1={y1 - 48} x2={x2 + 4.5} y2={y1 - 48} />
    <line className="tuplet-bracket" x1={x2 + 4.5} y1={y1 - 48} x2={x2 + 4.5} y2={y1 - 46} />
  </>

  return code

}




/* Beam one note
1. element to beam
2. lastLocation: x,y coordinates of the last element
3. lastRhythm: rhythm of the last element
4. lastLastRhythm: rhythm of the element before the last
5. lastStart: the starting beat of the last element
6. timeSignature of the measure
7. lastBeamed is 1 if the two previous notes were beamed and the same number of lines, 2 if the two previous notes were beamed but the first had more beams, 3 if the two previous notes were beamed but the second had more beams, and 0 else
8. isGrace: true if these notes are grace notes
RETURNS code
*/
function beamNote(element: Element, lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeSignature: [number, RhythmNumber], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean) : [ReactElement, 0 | 1 | 2 | 3] {

  let code : ReactElement = <></>
  let newLastBeamed : 0 | 1 | 2 | 3 = 0

  const noteHead = element.noteInfo

  switch (noteHead.kind) {
    case "singleNote":

      [code, newLastBeamed] = beamHelper(element, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeSignature, lastBeamed, isGrace, noteHead.note.string)
      break;

    case "groupNote":

      // Find out if any of the notes in the group are on string 6
      let groupString : GuitarString = 1

      for (let i = 0; i < noteHead.notes.length; i++) {
        if (noteHead.notes[i].string === 6) {
          groupString = 6
          break;
        }
      }

      [code, newLastBeamed] = beamHelper(element, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeSignature, lastBeamed, isGrace, groupString)
      break;


    case "tupletNote":

      let codeTemp : ReactElement = <></>
      let newLastBeamedTemp : 0 | 1 | 2 | 3 = 0

      const notes = noteHead.notes

      // Draw the tuplet bracket
      const tupletBracketCode : ReactElement = drawTupletBracket(notes)


      // Beam each note within the tuplet individually
      code = <>
        {tupletBracketCode}
        {
          notes.map((n, index) => {

            [codeTemp, newLastBeamedTemp] = beamNote(n, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeSignature, lastBeamed, isGrace)

            lastBeamed = newLastBeamedTemp
            lastLastRhythm = lastRhythm
            lastRhythm = n.duration
            lastStart = n.start
            lastLocation = n.location

            return <Fragment key={index}>
              {codeTemp}
            </Fragment>

          })
        }
      </>


      break;

    default:

    // TODO

  }

  return [code, newLastBeamed]

}




/* Beam driver
1. elements of the measure
2. lastLocation: x,y coordinates of the last element
3. lastRhythm: rhythm of the last element
4. lastLastRhythm: rhythm of the element before the last
5. lastStart: the starting beat of the last element
6. timeSignature of the measure
7. lastBeamed is 1 if the two previous notes were beamed and the same number of lines, 2 if the two previous notes were beamed but the first had more beams, 3 if the two previous notes were beamed but the second had more beams, and 0 else
8. isGrace: true if these notes are grace notes
RETURNS code
*/
export function beam(elements: Element[], lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeSignature: [number, RhythmNumber], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean) : ReactElement {

  let newLastBeamed : 0 | 1 | 2 | 3 = 0
  let code : ReactElement = <></>

  const result = <>

    {
      elements.map((el, index) => {

        [code, newLastBeamed] = beamNote(el, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeSignature, lastBeamed, isGrace)

        lastBeamed = newLastBeamed
        lastLastRhythm = lastRhythm
        lastRhythm = el.duration
        lastStart = el.start

        // for the location, check if it's a tuplet note. If so, the last location is the location of the tuplet's final note
        if (el.noteInfo.kind === "tupletNote") {
          lastLocation = el.noteInfo.notes[el.noteInfo.notes.length - 1].location
        } else {
          lastLocation = el.location
        }


        return <Fragment key={index}>
          {code}
        </Fragment>
      })
    }

  </>

  return result

}




/* Beam grace notes
1. elements of the measure
2. timeSignature of the measure
RETURNS code
*/
export function beamGraceNotes(elements: Element[], timeSignature: [number, RhythmNumber]) : ReactElement {

  let code : ReactElement = <></>
  let graceSlash : ReactElement = <></>

  const result = <>
    {
      elements.map((el, index) => {

        const noteHead = el.noteInfo

        // if it's a tuplet note, recurse on the elements within
        if (noteHead.kind === "tupletNote") {
          code = beamGraceNotes(noteHead.notes, timeSignature)
        } else {

          // call the beam function
          const noRhythm : Rhythm = "norhythm"
          code = beam(el.graceNotes, [0.0,0.0], noRhythm, noRhythm, 0.0, timeSignature, 0, true)

          // draw the slash
          if (el.graceNotes.length > 0) {

            const [sx,sy] = el.graceNotes[0].location

            graceSlash = <>
              <line className="grace-slash" x1={sx - 0.7} y1={sy - 33} x2={sx + 3.3} y2={sy - 37.4} />
            </>
          }

        }


        return <Fragment key={index}>
          {code}
          {graceSlash}
        </Fragment>

      })
    }
  </>

  return result
}
