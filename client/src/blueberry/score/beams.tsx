import { Element, Rhythm, RhythmNumber, GuitarString } from "./types"
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
RETURNS code
*/
function beamHelper(element: Element, lastLocation: [number, number], lastRhythm: Rhythm, lastLastRhythm: Rhythm, lastStart: number, timeSignature: [number, RhythmNumber], lastBeamed: 0 | 1 | 2 | 3, isGrace: boolean, guitarString: GuitarString) : [ReactElement, 0 | 1 | 2 | 3] {

  return [<></>, 0]

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

      // TODO draw the tuplet bracket

      const notes = noteHead.notes

      // Beam each note within the tuplet individually
      code = <>
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

  console.log(elements)

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

  return <></>

}
