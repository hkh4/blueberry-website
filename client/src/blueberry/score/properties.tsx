import { ReactElement, Fragment } from "react"
import { PropertyList, Page, Line, Measure, Element, Notehead, GuitarString, Pitch, Ints, EitherProperty, MultiProperty, Note } from "./types"


/* Draw all eitherProperties
1. currentString is the guitar string of this note
2. eProperties is the list of EitherProperties
3. pitch is the pitch of the note
4. fret is the fret of the currrent note (-1 if an X)
5. yCoord is the y coordinate based on which string the note is on
6. propertyList: used to keep track of properties that extend past lines or pages
7. isGrace: whether or not this note is a grace note
8. x location
9. y location
10. measureNumber for errors
RETURNS the code and the updated propertyList
*/
function drawEProperties(currentString: number, eProperties: EitherProperty[], pitch: Pitch, fret: number, yCoord: number, propertyList: PropertyList, isGrace: boolean, x: number, y: number, measureNumber: number) : [ReactElement, PropertyList] {
  // TODO
  return [<></>, propertyList]

}





/* Draw a strumUp
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. bottomString: the lowest string in this element
6. topString: the highest string in this element
RETURNS the strumUp code and the updated propertyList
*/
function drawStrumUp(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], bottomString: number, topString: number) : ReactElement {

  return <></>

}





/* Draw a slur
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. propertyList: used to keep track of properties that extend past lines or pages
6. measureNumber for errors
RETURNS the slur code and the updated propertyList
*/
function drawSlur(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], propertyList: PropertyList, measureNumber: number) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // Check to see if the beginning and ending slur properties exist
  const sls = mProperties.includes("sls")
  const sle = mProperties.includes("sle")

  if (sls && sle) {
    // If a note has both a slur start and a slur end, throw an error
    throw new Error(`Error in measure ${measureNumber}. Can't have a slur start and slur end on the same note!`)

  } else if (sls) {
    // If a note only has a slur start
    // Check if the slur start in the property list is valid. If so, throw an error due to overlapping slurs
    if (propertyList.slurStart[2]) {
      throw new Error(`Error in measure ${measureNumber}. Overlapping slurs detected. A slur must be ended before another one can start`)
    } else {

      // Update the slur start
      newPropertyList.slurStart = [[x,y], isGrace, true]

      return [<></>, newPropertyList]

    }

  } else if (sle) {

    // If a note has only the end slur
    // Check to see if there was a slur started
    if (propertyList.slurStart[2]) {

      // If there was a slur start, decompose slurStart and use the properties to draw the slur
      let [[oldX, oldY], oldIsGrace, _] = propertyList.slurStart

      oldX += 2.6
      x += 0.4
      let diff = x - oldX
      let halfway = diff * 0.3

      let slurCode : ReactElement = <></>

      if (oldIsGrace && isGrace) {

        oldX -= 1
        x += 0.3
        diff = x - oldX
        halfway = diff * 0.3

        slurCode = <path className="slur-grace" d={`M ${oldX} ${oldY - 41.5} C ${oldX + halfway} ${oldY - 44}, ${x - halfway} ${y - 44}, ${x} ${y - 41.5}`} />
      } else {
        if (diff < 20) {
          slurCode = <path className="slur" d={`M ${oldX} ${oldY - 44} C ${oldX + halfway} ${oldY - 47}, ${x - halfway} ${y - 41.5}, ${x} ${y - 44}`} />
        } else if (diff < 80) {
          slurCode = <path className="slur" d={`M ${oldX} ${oldY - 44} C ${oldX + halfway} ${oldY - 48.5}, ${x - halfway} ${y - 48.5}, ${x} ${y - 44}`} />
        } else if (diff < 150) {
          slurCode = <path className="slur" d={`M ${oldX} ${oldY - 44} C ${oldX + halfway} ${oldY - 51.5}, ${x - halfway} ${y - 51.5}, ${x} ${y - 44}`} />
        } else {
          slurCode = <path className="slur" d={`M ${oldX} ${oldY - 44} C ${oldX + halfway} ${oldY - 55}, ${x - halfway} ${y - 55}, ${x} ${y - 44}`} />
        }
      }

      newPropertyList.slurStart = [[0,0],false,false]

      return [slurCode, newPropertyList]


    } else {
      // no slur started, throw error
      throw new Error(`Error in measure ${measureNumber}. Cannot end a slur without starting one first`)
    }

  } else {

  }

  return [<></>, propertyList]

}





/* Draw all multiProperties
1. mProperties: list of multiProperties attached to this note
2. propertyList: used to keep track of properties that extend past lines or pages
3. isGrace: whether or not this note is a grace note
4. x location
5. y location
6. bottomString: the lowest string in this element, used for groups
7. topString: highest string in this element, used for groups
8. measureNumber used for errors
RETURNS the code and the updated propertyList
*/
function drawMProperties(mProperties: MultiProperty[], propertyList: PropertyList, isGrace: boolean, x: number, y: number, bottomString: number, topString: number, measureNumber: number) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // Slurs
  const slurResult = drawSlur(isGrace, x, y, mProperties, newPropertyList, measureNumber)
  newPropertyList = slurResult[1]

  // Strum up
  const strumUpResult = drawStrumUp(isGrace, x, y, mProperties, bottomString, topString)

  const code = <>
    {slurResult[0]}
    {strumUpResult}
  </>

  // TODO


  return [code, newPropertyList]

}





/* Draw properties of an element
1. el is the current Element
2. propertyList: used to keep track of properties that extend past lines or pages
3. isGrace: if this note is a grace note or not
4. measureNumber for error messages
RETURNS the code and the updated propertyList
*/
function drawPropertiesElement(el: Element, propertyList: PropertyList, isGrace: boolean, measureNumber: number) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}
  let mPropertiesCode : ReactElement = <></>
  let ePropertiesCode : ReactElement = <></>

  const noteInfo : Notehead = el.noteInfo
  const [currentX, currentY] = el.location

  switch (noteInfo.kind) {

    case "singleNote": {

      // get some useful properties of the note
      let currentString : GuitarString
      let pitchOfNote : Pitch
      let fret : number
      let eProperties : EitherProperty[]

      const note = noteInfo.note

      if (note.noteKind === "normalGuitarNote") {

        currentString = note.string
        pitchOfNote = note.pitch
        fret = note.fret
        eProperties = note.eitherProperties

      } else {

        currentString = note.string
        pitchOfNote = "nopitch"
        fret = -1
        eProperties = note.eitherProperties

      }

      const yCoord = currentY - 2.3 + (6 * (currentString - 1))

      // Draw the mProperties
      const mResult = drawMProperties(noteInfo.multiProperties, newPropertyList, isGrace, currentX, currentY, currentString, currentString, measureNumber)

      mPropertiesCode = mResult[0]
      newPropertyList = mResult[1]

      // draw the eProperties
      const eResult = drawEProperties(currentString, eProperties, pitchOfNote, fret, yCoord, newPropertyList, isGrace, currentX, currentY, measureNumber)

      ePropertiesCode = eResult[0]
      newPropertyList = eResult[1]

      break;

    }

    case "groupNote": {

      const notes : Note[] = noteInfo.notes

      ePropertiesCode = <>

        {
          notes.map((note, index) => {

            let currentString : GuitarString
            let pitchOfNote : Pitch
            let fret : number
            let eProperties : EitherProperty[]

            if (note.noteKind === "normalGuitarNote") {

              currentString = note.string
              pitchOfNote = note.pitch
              fret = note.fret
              eProperties = note.eitherProperties

            } else {

              currentString = note.string
              pitchOfNote = "nopitch"
              fret = -1
              eProperties = note.eitherProperties

            }

            const yCoord = currentY - 2.3 + (6 * (currentString - 1))

            // draw the eProperties
            const eResult = drawEProperties(currentString, eProperties, pitchOfNote, fret, yCoord, newPropertyList, isGrace, currentX, currentY, measureNumber)

            newPropertyList = eResult[1]

            return <Fragment key={index}>
              {eResult[0]}
            </Fragment>
          })
        }

      </>

      // Draw the mProperties
      // First figure out which strings are being used

      const stringsUsed = notes.map(n => {
        return n.string
      })

      stringsUsed.sort()

      const mResult = drawMProperties(noteInfo.multiProperties, newPropertyList, isGrace, currentX, currentY, stringsUsed[0], stringsUsed[stringsUsed.length - 1], measureNumber)

      mPropertiesCode = mResult[0]
      newPropertyList = mResult[1]

      break;

    }


    case "tupletNote": {

      // Draw the properties on each of the notes
      const notes : Element[] = noteInfo.notes
      const result : ReactElement = <></>

      // Just recurse and return
      const allResult = <>
        {
          notes.map((note, index) => {

            const r = drawPropertiesElement(note, newPropertyList, isGrace, measureNumber)

            newPropertyList = r[1]

            return r[0]
          })
        }
      </>

      return [allResult, newPropertyList]
    }

  }

  const result = <>
  {mPropertiesCode}
  {ePropertiesCode}
  </>

  return [result, newPropertyList]

}





/* Helper to draw the properties of a group of grace notes
1. els: list of grace notes
2. propertyList: used to keep track of properties that extend past lines or pages
3. measureNumber for error messages
RETURNS the code and the updated propertyList
*/
function drawPropertiesElementGrace(els: Element[], propertyList: PropertyList, measureNumber: number) : [ReactElement, PropertyList] {

  let newPropertyList: PropertyList = {...propertyList}

  let graceCode : ReactElement = <></>

  const result = <>
    {
      els.map((el, index) => {

        [graceCode, newPropertyList] = drawPropertiesElement(el, newPropertyList, true, measureNumber)

        return <Fragment key={index}>
          {graceCode}
        </Fragment>

      })
    }
  </>

  return [result, newPropertyList]

}





/* Draw properties for a measure
1. elements: the elements of the measure, whose properties will be drawn
2. propertyList: used to keep track of properties that extend past lines or pages
3. measureNumber: for errors
*/
function drawPropertiesMeasure(elements: Element[], propertyList: PropertyList, measureNumber: number) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  let elementCode : ReactElement = <></>
  let elementGraceCode : ReactElement = <></>

  const elementsCode = <>

    {
      elements.map((el, index) => {

        const noteInfo : Notehead = el.noteInfo

        // If it's a tupletNote, just recurse on each note within
        if (noteInfo.kind === "tupletNote") {
          [elementCode, newPropertyList] = drawPropertiesMeasure(noteInfo.notes, newPropertyList, measureNumber)

        } else {

          // Draw the properties of each grace note
          const result = drawPropertiesElementGrace(el.graceNotes, newPropertyList, measureNumber)
          elementGraceCode = result[0]
          newPropertyList = result[1]

          // Draw the properties of the notes themselves
          const result2 = drawPropertiesElement(el, newPropertyList, false, measureNumber)
          elementCode = result2[0]
          newPropertyList = result2[1]

        }

        return <Fragment key={index}>
          {elementCode}
          {elementGraceCode}
        </Fragment>

      })
    }

  </>

  return [elementsCode, newPropertyList]

}





/* Check and draw any needed endings for line properties, if a property extends to the next line
*/
function checkLineEndings(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  // TODO

  return [<></>, propertyList]

}





/* Draw properties for a line
1. line: the line whose properties will be drawn
2. propertyList: used to keep track of properties that extend past lines or pages
*/
function drawPropertiesLine(line: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  const measures : Measure[] = line.measures
  let newPropertyList : PropertyList = {...propertyList}

  let measureCode : ReactElement = <></>

  const measuresCode = <>

    {
      measures.map((measure, index) => {

        [measureCode, newPropertyList] = drawPropertiesMeasure(measure.elements, newPropertyList, measure.measureNumber)

        return <Fragment key={index}>
          {measureCode}
        </Fragment>

      })
    }

  </>

  return [measuresCode, newPropertyList]

}





/* Driver for drawing properties
1. page: the page whose properties will all be drawn
2. propertyList: used to keep track of properties that extend past lines or pages
*/
export function drawProperties(page: Page, propertyList: PropertyList) : [ReactElement, PropertyList] {

  const lines : Line[] = page.lines
  let newPropertyList : PropertyList = {...propertyList}

  let lineCode : ReactElement = <></>

  const linesCode = <>

    {
      lines.map((line, index) => {

        [lineCode, newPropertyList] = drawPropertiesLine(line, newPropertyList)

        {/* Check endings */}
        let lineEndCode : ReactElement = <></>
        if (index < lines.length - 1) {
          [lineEndCode, newPropertyList] = checkLineEndings(lines[index + 1], newPropertyList)
        }


        return <Fragment key={index}>
          {lineCode}
          {lineEndCode}
        </Fragment>

      })
    }

  </>

  // TODO
  // Check line endings
  // Check page endings if needed (check to see if last line)

  const result = <>
    {linesCode}
  </>

  return [result, newPropertyList]

}































//
