import { Element, Rhythm, RhythmNumber, GuitarString, isRhythmNumberNumber } from "./types"
import { numberOfBeams } from "./constants"
import { Fragment, ReactElement } from "react"


/* Draw the stubs at the end of the note
1. x is the x location
2. y is the y location
3. beamsToAdd is the number of beams to draw
4. isGrace is whether or not these notes are grace notes
RETURNS code
*/
function endingStubs(x: number, y: number, beamsToAdd: number, isGrace: boolean) : ReactElement {

  return <></>

}





/* Draw initial stubs at the beginning of the note when it needs more beams than its neighbors
1. x is the x location
2. y is the y location
3. beamsToAdd is the number of beams to draw
4. isGrace is whether or not these notes are grace notes
RETURNS code
*/
function initialStubs(x: number, y: number, beamsToAdd: number, isGrace: boolean) : ReactElement {

  return <></>

}





/* Draw the full beams between two notes
1. x is the x location of the last note
2. newX is the x location of the current note
3. y is the y location
4. beamsToAdd is the number of beams to draw
5. isGrace is whether or not these notes are grace notes
RETURNS code
*/
function fullBeams(x: number, newX: number, y: number, beamsToAdd: number, isGrace: boolean) : ReactElement {

  const l = Array.from({length: beamsToAdd}, (_, i) => i)

  if (isGrace) {

    return <>

      {
        l.map((el, index) => {
          return <line key={index} className="beam-grace" x1={x + 0.85} y1={y - 40 + (el * 1.5)} x2={newX + 1.35} y2={y - 40 + (el * 1.5)} />
        })
      }

    </>

  } else {

    return <>

      {
        l.map((el, index) => {
          return <line key={index} className="beam" x1={x + 1.15} y1={y - 42 + (el * 2.4)} x2={newX + 1.85} y2={y - 42 + (el * 2.4)} />
        })
      }

    </>
  }


}





/* Check if two rhythms are in the same time group of a timeKey
1. timeKey is the list of lists used to determine which beats are beamed together
2. num is the beat number being looked for
RETURNS the index of what subarray the beat number lies in
*/
function findElementInKey(timeKey: number[][], num: number) : number {

  let index = -1

  for (let i = 0; i < timeKey.length; i++) {
    if (timeKey[i].includes(num)) {
      index = i
    }
  }

  return index

}





/* Helper for beamByTime, only reached if a beam is really needed
*/
function beamByTimeHelper(element: Element, currentRhythmNumber: RhythmNumber, lastLocation: [number, number], lastRhythmNumber: RhythmNumber, lastLastRhythm: Rhythm, lastStart: number, lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean) : [ReactElement, 0 | 1 | 2 | 3] {

  // number of beams for the previous and current notes
  const beamsOfPrevious = numberOfBeams[lastRhythmNumber]
  const beamsOfCurrent = numberOfBeams[currentRhythmNumber]

  const [x,y] = lastLocation
  const [newX, newY] = element.location

  if (beamsOfPrevious === beamsOfCurrent) {
    // If the two notes have the same number of beams, just draw the full beams
    const fullBeamsCode : ReactElement = fullBeams(lastLocation[0], newX, newY, beamsOfCurrent, isGrace)

    return [fullBeamsCode, 1]

  } else if (beamsOfPrevious > beamsOfCurrent) {
    // If the last note has more beams than the current
    const fullBeamsCode : ReactElement = fullBeams(x, newX, newY, beamsOfCurrent, isGrace)

    switch (lastBeamed) {

      case 0:
        // if the last note and lastlast note were not beamed, then the last note needs an initial stub since it needs more beams than the current
        const iStubs : ReactElement = initialStubs(x, y, beamsOfPrevious, isGrace)

        const result : ReactElement = <>
          {fullBeamsCode}
          {iStubs}
        </>

        return [result, 2]

      case 1:
      case 2:

        return [fullBeamsCode, 2]

      case 3:
        // if the last note had more beams than lastlast, some sort of stub is needed.
        if (!isRhythmNumberNumber(lastLastRhythm)) {
          throw new Error("Error in beamByTimeHelper. norhythm appeared")
        }

        const lastLastRhythmNumber : RhythmNumber = lastLastRhythm[0]

        const numberOfBeamsLastLast = numberOfBeams[lastLastRhythmNumber]

        if (numberOfBeamsLastLast < numberOfBeams) {
          // If this note has more beams than lastlast, then last gets an initial stub
          const iStubs : ReactElement = initialStubs(x, y, beamsOfPrevious, isGrace)

          const result : ReactElement = <>
            {fullBeamsCode}
            {iStubs}
          </>

          return [result, 2]

        } else {
          // Otherwise, it gets an end stub
          const eStubs : ReactElement = endingStubs(x, y, beamsOfPrevious, isGrace)

          const result : ReactElement = <>
            {fullBeamsCode}
            {eStubs}
          </>

          return [result, 2]

        }


    }

  } else {
    // If this note has more beams than the last, just draw the full beams. Any needed stubs or flags will be taken care of later
    const fullBeamsCode : ReactElement = fullBeams(lastLocation[0], newX, newY, beamsOfCurrent, isGrace)

    return [fullBeamsCode, 3]

  }

}





/* Actually draw the beams, based on the timeKey
1. element to beam
2. lastLocation: x,y coordinates of the last element
3. lastRhythm: rhythm of the last element
4. lastLastRhythm: rhythm of the element before the last
5. lastStart: the starting beat of the last element
6. timeKey is the list of lists used to determine which beats are beamed together
7. lastBeamed is 1 if the two previous notes were beamed and the same number of lines, 2 if the two previous notes were beamed but the first had more beams, 3 if the two previous notes were beamed but the second had more beams, and 0 else
8. isGrace: true if these notes are grace notes
RETURNS code, new lastBeamed number
*/
function beamByTime(element: Element, lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeKey: number[][], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean) : [ReactElement, 0 | 1 | 2 | 3] {

  // decompose important variables
  const [oldX, oldY] = lastLocation
  const [newX, newY] = element.location

  if (!isRhythmNumberNumber(element.duration) || !isRhythmNumberNumber(lastRhythm)) {
    throw new Error("Error in beamByTime: duration should not be norhythm")
  }

  const [currentRhythmNumber, currentDots] = element.duration
  const [previousRhythmNumber, previousDots] = lastRhythm

  // Check to see if the current note and previous note were in the same time group. If so, beam. If not, maybe beam, more checks are needed
  const indexOfLast = findElementInKey(timeKey, Math.floor(lastStart))
  const indexOfCurrent = findElementInKey(timeKey, Math.floor(element.start))

  if (indexOfLast === indexOfCurrent) {
    // If they're in the same group, beam
    return beamByTimeHelper(element, currentRhythmNumber, lastLocation, previousRhythmNumber, lastLastRhythm, lastStart, lastBeamed, isGrace)

  } else {
    // If they're not in the same group, beam if the previous element went PAST the exact start of the current beat. e.g. last start was 2.9, current start is 3.1, not exactly 3.0, so beam
    // Just need to check that the start of the current note has a decimal
    const wholeNumber = Math.floor(element.start)
    const difference = element.start - wholeNumber

    if (difference > 0 ) {
      return beamByTimeHelper(element, currentRhythmNumber, lastLocation, previousRhythmNumber, lastLastRhythm, lastStart, lastBeamed, isGrace)
    }

    //TODO
    // No beam, instead check for a flag


    return [<></>, 0]

  }

}





/* Helper to beam a note
1. element to beam
2. lastLocation: x,y coordinates of the last element
3. lastRhythm: rhythm of the last element
4. lastLastRhythm: rhythm of the element before the last
5. lastStart: the starting beat of the last element
6. timeKey is the list of lists used to determine which beats are beamed together
7. lastBeamed is 1 if the two previous notes were beamed and the same number of lines, 2 if the two previous notes were beamed but the first had more beams, 3 if the two previous notes were beamed but the second had more beams, and 0 else
8. isGrace: true if these notes are grace notes
9. guitarString: what string is this note on. Used for graphics
RETURNS code, new lastBeamed number
*/
function beamHelper(element: Element, lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeKey: number[][], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean, guitarString: GuitarString) : [ReactElement, 0 | 1 | 2 | 3] {

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

  // get info
  if (!isRhythmNumberNumber(element.duration)) {
    throw new Error("Error in beamHelper. A note in beamHelper should not have a rhythm of norhythm")
  }

  // Decompose rhythm
  let beatNumber : RhythmNumber
  let dotNumber : number
  [beatNumber, dotNumber] = element.duration
  let dotArray = Array.from(Array(dotNumber).keys())

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

  let beamCode : ReactElement = <></>
  let newLastBeamed : 0 | 1 | 2 | 3 = 0

  if (isRhythmNumberNumber(lastRhythm)) {

    const [lastRhythmNumber, lastDots] = lastRhythm

    // Only need to beam if the last note was an 8th note or shorter, and the current note is an 8th note or shorter
    if ([8,16,32,64].includes(lastRhythmNumber) && [8,16,32,64].includes(beatNumber)) {

      [beamCode, newLastBeamed] = beamByTime(element, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeKey, lastBeamed, isGrace)

    }

  }

  // TODO if this note is a quarter note or longer, check end flags and stubs

  const result : ReactElement = <>
    {stem}
    {dots}
    {beamCode}
  </>

  return [result, newLastBeamed]

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
6. timeKey is the list of lists used to determine which beats are beamed together
7. lastBeamed is 1 if the two previous notes were beamed and the same number of lines, 2 if the two previous notes were beamed but the first had more beams, 3 if the two previous notes were beamed but the second had more beams, and 0 else
8. isGrace: true if these notes are grace notes
RETURNS code
*/
function beamNote(element: Element, lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeKey: number[][], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean) : [ReactElement, 0 | 1 | 2 | 3] {

  let code : ReactElement = <></>
  let newLastBeamed : 0 | 1 | 2 | 3 = 0

  const noteHead = element.noteInfo

  switch (noteHead.kind) {
    case "singleNote":

      [code, newLastBeamed] = beamHelper(element, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeKey, lastBeamed, isGrace, noteHead.note.string)
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

      [code, newLastBeamed] = beamHelper(element, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeKey, lastBeamed, isGrace, groupString)
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

            [codeTemp, newLastBeamedTemp] = beamNote(n, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeKey, lastBeamed, isGrace)

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

    // TODO if not a note, do the end checks. Add grace curve if needed, check beam flags and stubs

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

  // Create the key based on the time signature
  const [timeTop, timeBottom] = timeSignature

  let timeKey : number[][] = []

  // If quarter, half, or whole note gets a beat, each beat is its own group
  // E.g. if 6/4, the list is [[1],[2],[3],[4],[5],[6]]
  if ([1,2,4].includes(timeBottom)) {

    timeKey = Array.from({length: timeTop}, (_, i) => [i+1])

  // If 8th or shorter gets a beat:
  } else if ([8,16,32,64].includes(timeBottom)) {

    // If the number of beats is even but NOT a multiple of 3, each beat is its own group
    if (timeTop % 2 === 0) {

      timeKey = Array.from({length: timeTop}, (_, i) => [i+1])

    // For multiples of 3, group is 3s
    } else if (timeTop % 3 === 0) {

      const numGroups = timeTop / 3
      timeKey = Array.from({length: numGroups}, (_, i) => [i*3+1, i*3+2, i*3+3])

    // For 5s, group 3+2 by default
    } else if (timeTop === 5) {

      timeKey = [[1,2,3],[4,5]]

    // For 7s, group 3+2+2 by default
    } else if (timeTop === 7) {

      timeKey = [[1,2,3],[4,5],[6,7]]

    // Not yet implemented
    } else {
      throw new Error("This time signature has not yet been implemented! Sorry!")
    }

  } else {
    throw new Error("This time signature has not yet been implemented! Sorry!")
  }



  const result = <>

    {
      elements.map((el, index) => {

        [code, newLastBeamed] = beamNote(el, lastLocation, lastRhythm, lastLastRhythm, lastStart, timeKey, lastBeamed, isGrace)

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
