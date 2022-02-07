import { Page, PropertyList, OptionsRecord, Line, Measure, Element, SingleNote, GroupNote, TupletNote, Note, NormalGuitarNote, X, Rest, GuitarString, Ints, isRhythmNumberNumber, Rhythm } from "./types"
import { paperWidth, paperHeight, firstLineWidth, otherLinesWidth, firstLineBuffer, otherLinesBuffer, emptyElementWidth } from "./constants"
import { Fragment, ReactElement } from "react"
import { style } from "./style"
import { defs } from "./svgDefs"

// Property list that will be used and updated throughout
let propertyList : PropertyList = {
  slurStart: [[0.0,0.0], false, false],
  muteStart: [[0.0,0.0], false],
  tieStart: {
    s1: [[0.0,0.0], 0.0, false, false],
    s2: [[0.0,0.0], 0.0, false, false],
    s3: [[0.0,0.0], 0.0, false, false],
    s4: [[0.0,0.0], 0.0, false, false],
    s5: [[0.0,0.0], 0.0, false, false],
    s6: [[0.0,0.0], 0.0, false, false]
  },
  slideStart: {
    s1: [[0.0,0.0], 0.0, false, false],
    s2: [[0.0,0.0], 0.0, false, false],
    s3: [[0.0,0.0], 0.0, false, false],
    s4: [[0.0,0.0], 0.0, false, false],
    s5: [[0.0,0.0], 0.0, false, false],
    s6: [[0.0,0.0], 0.0, false, false]
  },
  slideStubs: {
    s1: [[0.0,0.0], 0.0, false, false],
    s2: [[0.0,0.0], 0.0, false, false],
    s3: [[0.0,0.0], 0.0, false, false],
    s4: [[0.0,0.0], 0.0, false, false],
    s5: [[0.0,0.0], 0.0, false, false],
    s6: [[0.0,0.0], 0.0, false, false]
  },
  hammerStart: {
    s1: [[0.0,0.0], 0.0, false, false],
    s2: [[0.0,0.0], 0.0, false, false],
    s3: [[0.0,0.0], 0.0, false, false],
    s4: [[0.0,0.0], 0.0, false, false],
    s5: [[0.0,0.0], 0.0, false, false],
    s6: [[0.0,0.0], 0.0, false, false]
  }
}




/* Show the fret number
1. x location
2. y location
3. guitarString: what string of the guitar is this note on
4. fret
RETURNS code
*/
function showNormalGuitarNote(x: number, y: number, guitarString: GuitarString, fret: number) : ReactElement {

  const newY = (y + 2) - (6 * (guitarString - 1))

  return <use href={`#fret${fret}`} x={x} y={newY} />

}




/* Show an x
1. x location
2. y location
3. guitarString: what string of the guitar is this note on
RETURNS code
*/
function showX(x: number, y: number, guitarString: GuitarString) : ReactElement {

  const newY = (y + 2) - (6 * (guitarString - 1))

  return <use href="#fretx" x={x} y={newY} />

}




/* Helper to show a single grace note
1. graceNote to be shown
2. x location
3. y location
4. scale for width
RETURNS the new x value, the updated grace note, and the code
*/
function showGraceNote(graceNote: Element, x: number, y: number, scale: number) : [number, Element, ReactElement] {

  let code : ReactElement = <></>

  // ******** Helper functions
  function showNormalGraceNote(x: number, y: number, guitarString: GuitarString, fret: number) : ReactElement {

    const newY = (y + 1.5) - (6 * (guitarString - 1))
    return <use href={`#fret${fret}g`} x={x} y={newY} />

  }

  function showXGrace(x: number, y: number, guitarString: GuitarString) : ReactElement {

    const newY = (y + 1.5) - (6 * (guitarString - 1))
    return <use href="#fretxg" x={x} y={newY} />

  }

  // ********
  const noteInfo = graceNote.noteInfo

  switch (noteInfo.kind) {

    case "singleNote":

      const note = noteInfo.note

      if (note.noteKind === "normalGuitarNote") {
        code = showNormalGraceNote(x, y, note.string, note.fret)

      } else {
        code = showXGrace(x, y, note.string)

      }

      break;

    // case "groupNote":
    //   break;
    // case "tupletNote":
    //   break;
    default:
  }

  const newGraceNote : Element = {
    ...graceNote,
    location: [x,y]
  }

  const newX = x + (scale * graceNote.width)

  return [newX, newGraceNote, code]

}




function showGraceNotes(graceNotes: Element[], x: number, y: number, scale: number) : [number, Element[], ReactElement] {

  let graceCode : ReactElement = <></>
  let newX : number = x
  let newGraceNotes : Element[] = []
  let newGraceNote : Element

  const result : ReactElement = <>

    {graceNotes.map((g, index) => {

      [newX, newGraceNote, graceCode] = showGraceNote(g, newX, y, scale)
      newGraceNotes.push(newGraceNote)

      return <Fragment key={index}>
        {graceCode}
      </Fragment>

    })}

  </>

  return [newX, newGraceNotes, result]

}





/* Show a singleNote
1. element with the singleNote inside it
2. x location
3. y location
4. scale for widths
RETURNS the updated element, and code to show this note
*/
function showSingleNote(element: Element, x: number, y: number, scale: number) : [Element, ReactElement] {

  // typecheck
  if (element.noteInfo.kind !== "singleNote") {
    throw new Error("Internal error in showSingleNote. A different notehead was given")
  }
  const singleNote : SingleNote = element.noteInfo

  let newX : number = x
  let graceCode : ReactElement = <></>
  let newGraceNotes : Element[] = []

  // Show grace notes, if needed
  if (element.graceNotes.length > 0) {
    [newX, newGraceNotes, graceCode] = showGraceNotes(element.graceNotes, x, y, scale)
  }

  const note : Note = singleNote.note
  let noteCode : ReactElement = <></>

  // Then, show the note itself
  if (note.noteKind === "normalGuitarNote") {
    // normalguitarnote
    noteCode = showNormalGuitarNote(newX, y, note.string, note.fret)

  } else {
    // x note
    noteCode = showX(newX, y, note.string)
  }

  const result = <>
    {graceCode}
    {noteCode}
  </>

  const newElement : Element = {
    ...element,
    location: [newX,y]
  }

  return [newElement, result]

}




/* Show a rest
1. element: rest to be shown
2. x location
3. y location
4. width of the whole measure, used for 0 rests
RETURN the rest code
*/
function showRest(element: Element, x: number, y: number, width: number) : ReactElement {

  let code: ReactElement = <></>

  const duration : Rhythm = element.duration

  // Make sure it isn't a "norhythm"
  if (!isRhythmNumberNumber(duration)) {
    throw new Error("Internal error in showRest. A 'norhythm' shouldn't appear here")
  }

  const [rhythm, dots] = duration

  switch (rhythm) {

    case 0:

      code = <>
        <use href="#halfwholerest" x={x + (width / 2) - 7} y={y - 15.8} />
      </>
      break;
    case 1:

      const dotsArray1 : ReactElement[] = []
      // Create the dots
      for (let i = 0; i < dots; i++) {
        dotsArray1.push(<use key={i} href="#dot" x={x + 6.3 + (i * 1.7)} y={y - 19} />)
      }
      code = <>
        <use href="#halfwholerest" x={x} y={y - 15.8} />
        {dotsArray1}
      </>
      break;
    case 2:

      const dotsArray2 : ReactElement[] = []
      // Create the dots
      for (let i = 0; i < dots; i++) {
        dotsArray2.push(<use key={i} href="#dot" x={x + 6.3 + (i * 1.7)} y={y - 14.5} />)
      }
      code = <>
        <use href="#halfwholerest" x={x} y={y - 11.9} />
        {dotsArray2}
      </>
      break;
    case 4:

      const dotsArray4 : ReactElement[] = []
      // Create the dots
      for (let i = 0; i < dots; i++) {
        dotsArray4.push(<use key={i} href="#dot" x={x + 4.7 + (i * 1.7)} y={y - 15.7} />)
      }
      code = <>
        <use href="#quarterrest" x={x} y={y - 9} />
        {dotsArray4}
      </>
      break;
    case 8:
      break;
    case 16:
      break;
    case 32:
      break;
    case 64:
      break;
    default:

  }

  return code

}





/* Show an element
1. element to be shown
2. width: total width of the measure, used to centering the whole rest of an empty measure
3. scale: ratio used to scale how much space the element takes up
4. x location
5. y location
RETURNS the updated element, the code, and the new x location for the next element
*/
function showElement(element: Element, width: number, scale: number, x: number, y: number) : [Element, ReactElement, number] {

  let newElement : Element

  let newX : number = x;
  let code : ReactElement = <></>

  // First write out the comments
  const comment = <text className="comment" x={x + 2} y={y - 50} textAnchor="middle" >{element.comments}</text>

  const notehead = element.noteInfo

  // TODO
  switch (notehead.kind) {

    case "timeChange":

      code = <>
      <use href={`#time${notehead.newTime[0]}`} x={x + 7} y={y - 23} />
      <use href={`#time${notehead.newTime[1]}`} x={x + 7} y={y - 14.5} />
      </>

      newX += (scale * element.width)

      newElement = {
        ...element,
        location: [x,y]
      }
      break;

    case "buffer":
      // do nothing
      newElement = {
        ...element,
        location: [x,y]
      }
      break;
    case "empty":
      newX += 5
      newElement = {
        ...element,
        location: [x,y]
      }
      break;

    case "singleNote":

      [newElement, code] = showSingleNote(element, x, y, scale)
      newX += (scale * element.width)
      break;

    // case "groupNote":
    //
    //   newX += (scale * element.width)
    //   break;
    //
    // case "tupletNote":
    //
    //   newX += (scale * element.width)
    //   break;
    //
    case "rest":

      newX += (scale * element.width)
      newElement = {
        ...element,
        location: [x,y]
      }
      code = showRest(element, x, y, width)
      break;

    case "barline":

      code = <>
        <path className="measure-barline" d={`M ${x - 5} ${y + 0.2} l 0 -30.4`} />
      </>
      newX += (scale * element.width)

      newElement = {
        ...element,
        location: [x,y]
      }

      break;

    default:
      throw new Error("Internal error in showElement. Invalid noteInfo type")

  }

  const result = <>
    {comment}
    {code}
  </>

  return [newElement, result, newX]

}




/* Show measures
1. measure: the measure being shown
2. x location
3. y location
4. scale: ratio that the width of all elements should be changed by
RETURNS the updated measure, the code, and the width of the measure
*/
function showMeasure(measure: Measure, x: number, y: number, scale: number) : [Measure, ReactElement, number] {

  const elements : Element[] = measure.elements

  // width based on what the original width of the measure is, times the scale
  const newWidth = measure.width * scale

  // since the empty space at the beginning needs to be constant size, recalculate the scale based on that
  const insideScale = newWidth / (measure.width - emptyElementWidth)

  let newElement : Element
  let code : ReactElement
  let newX : number = x

  let updatedElements : Element[] = []

  const result = <>

    {
      measure.changes.capo &&
      <text x={x} y={y - 55} className="capo-change">{`capo ${measure.capo}`}</text>
    }

    {elements.map((el, index) => {

      [newElement, code, newX] = showElement(el, newWidth, insideScale, newX, y)
      updatedElements.push(newElement)

      return <Fragment key={index}>
        {code}
      </Fragment>

    })}
  </>

  // TODO
  // Beams


  const newMeasure : Measure = {
    ...measure,
    elements: updatedElements
  }

  return [newMeasure, result, newWidth]

}




/* Graphics for one line
1. line: line being shown
RETURNS the updated line, and the code
*/
function showLine(line: Line) : [Line, ReactElement] {

  // Starting position of the staff
  const [staffX, staffY] = line.start

  const staffLineWidth = line.lineNumber === 1 ? firstLineWidth : otherLinesWidth
  const x2 = staffX + staffLineWidth

  // Draw the staff lines
  const staffLines = <>
    <line className="staffline" x1={staffX} y1={staffY} x2={x2} y2={staffY} />
    <line className="staffline" x1={staffX} y1={staffY - 6} x2={x2} y2={staffY - 6} />
    <line className="staffline" x1={staffX} y1={staffY - 12} x2={x2} y2={staffY - 12} />
    <line className="staffline" x1={staffX} y1={staffY - 18} x2={x2} y2={staffY - 18} />
    <line className="staffline" x1={staffX} y1={staffY - 24} x2={x2} y2={staffY - 24} />
    <line className="staffline" x1={staffX} y1={staffY - 30} x2={x2} y2={staffY - 30} />

    <line className="barline" x1={staffX} y1={staffY + 0.2} x2={staffX} y2={staffY - 30.4} />
    <line className="barline" x1={x2} y1={staffY + 0.2} x2={x2} y2={staffY - 30.4} />

    <path className="fancy-line-main" d={`M ${staffX - 5} ${staffY + 5} l 0 -40`} />
    <path className="fancy-line-curl bottom-curl" d={`M ${staffX - 4} ${staffY + 5} C ${staffX - 2} ${staffY + 5}, ${staffX - 0.5} ${staffY + 5.5}, ${staffX + 2} ${staffY + 8} A 10 10 0 0 0 ${staffX - 6} ${staffY + 3}`} />
    <path className="fancy-line-curl top-curl" d={`M ${staffX - 4} ${staffY - 35} C ${staffX - 2} ${staffY - 35}, ${staffX - 0.5} ${staffY - 35.5}, ${staffX + 2} ${staffY - 38} A 10 10 0 0 1 ${staffX - 6} ${staffY - 33}`} />

  </>

  // Add the TAB clef, plus the time signature if it's the first line of the first page
  const clefAndTimeSignature = <>

    {/* "tab" clef */}

    <line style={{strokeWidth: "1px"}} x1={staffX + 3.1} y1={staffY - 26.3} x2={staffX + 8.6} y2={staffY - 26.3} />
    <line style={{strokeWidth: "1.1px"}} x1={staffX + 5.85} y1={staffY - 25.8} x2={staffX + 5.85} y2={staffY - 19.8} />

    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 2.6} ${staffY - 11.4} l 1.2 0 l 0.7 -2 l 2.8 0 l 0.7 2 l 1.2 0 l -2.7 -7 l -1.2 0 l -2.7 7`} />
    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 4.8} ${staffY - 14.3} l 2.2 0 l -1.1 -3.1 l -1.1 3.1`} fill="white" />

    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 3.5} ${staffY - 2.5} l 3.3 0 c 2.4 0 1.9 -3.7 0.9 -3.7 c 1 0 1.5 -3.7 -0.9 -3.7 l -3.3 0 l 0 7.4`} />
    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 4.5} ${staffY - 3.4} l 2.3 0 c 1 0 1 -2.3 0 -2.3 l -2.3 0 l 0 2.2`} fill="white" />
    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 4.5} ${staffY - 6.7} l 2.3 0 c 1 0 1 -2.3 0 -2.3 l -2.3 0 l 0 2.2`} fill="white" />

    {/* if it's the first line, add the time signature */}

    {
      line.lineNumber === 1 &&
      <>
      <use href={`#time${line.measures[0].time[0]}`} x={staffX + 17} y={staffY - 23} />
      <use href={`#time${line.measures[0].time[1]}`} x={staffX + 17} y={staffY - 14.5} />
      </>
    }

  </>

  // display the number of the first measure of this line
  const firstMeasureNumber = line.measures[0].measureNumber

  const measureNumberCode = <>
    <text x={staffX - 5} y={staffY - 40} textAnchor="start" className="measure-number">{firstMeasureNumber}</text>
  </>

  let newX;

  // Update the x location
  if (line.lineNumber === 1) {
    newX = staffX + firstLineBuffer
  } else {
    newX = staffX + otherLinesBuffer
  }

  // Figure out the scale
  const scale = (line.finalWidth + staffX - newX) / line.originalWidth

  // updated measures
  let updatedMeasures : Measure[] = []

  let code : ReactElement
  let newMeasure : Measure
  let widthOfMeasure : number

  const result =  <>
    {staffLines}
    {clefAndTimeSignature}
    {measureNumberCode}

    {
      line.measures.map((m, index) => {

        [newMeasure, code, widthOfMeasure] = showMeasure(m, newX, staffY, scale)
        updatedMeasures.push(newMeasure)
        newX += widthOfMeasure

        return <Fragment key={index}>
          {code}
        </Fragment>
      })
    }

  </>

  // TODO
  // END OF LINE PROPERTY CHECKS

  const newLine = {
    ...line,
    measures: updatedMeasures
  }

  return [newLine, result]

}




/* Graphics for one page
1. page: the page being shown
2. optionsR: optionsRecord to display, if needed
RETURNS the updated page, and the svg code
*/
function showPage(page: Page, optionsR: OptionsRecord) : [Page, ReactElement] {

  const lines : Line[] = page.lines
  const pageNumber: number = page.pageNumber

  const updatedLines : Line[] = []

  let result : ReactElement;

  if (pageNumber === 1) {

    result = <svg viewBox={`0 0 ${paperWidth} ${paperHeight}`}>
      {defs}
      <style>{style}</style>

      <text x="306" y="47" textAnchor="middle" className="title">{optionsR.title}</text>
      <text x="565" y="72" textAnchor="end" className="composer">{optionsR.composer}</text>
      <text x="40" y="72" textAnchor="start" className="capo">{`capo ${optionsR.capo}`}</text>
      <text x="40" y="87" textAnchor="start" className="tuning">{`Tuning: ${optionsR.tuning}`}</text>

      {lines.map((line, index) => {

        const [newLine, code] = showLine(line)
        updatedLines.push(newLine)

        return <Fragment key={index}>
          {code}
        </Fragment>
      })}

    </svg>
  } else {

    result = <svg viewBox={`0 0 ${paperWidth} ${paperHeight}`}>
      {defs}
      <style>{style}</style>
      {lines.map((line, index) => {

        const [newLine, code] = showLine(line)
        updatedLines.push(newLine)

        return <Fragment key={index}>
          {code}
        </Fragment>
      })}
    </svg>

  }

  const newPage : Page = {
    ...page,
    lines: updatedLines
  }

  // TODO
  // SOME SORT OF END OF PAGE PROPERTY CHECK

  return [newPage, result]


}




/* Graphics driver
1. pages
2. optionsRecord: all the starting options info to be displayed
RETURNS the updated pages, and all the svgs
*/
export function show(pages: Page[], optionsR: OptionsRecord) : [Page[], ReactElement] {

  let updatedPages : Page[] = []

  const result = <Fragment>

    {pages.map((page, index) => {

      const [newPage, code] = showPage(page, optionsR)
      updatedPages.push(newPage)

      return <Fragment key={index}>
        {code}
      </Fragment>
    })}

  </Fragment>

  return [updatedPages, result]


}












//
