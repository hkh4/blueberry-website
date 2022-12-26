import { ReactElement, Fragment } from "react"
import { PropertyList, Page, Line, Measure, Element, Notehead, GuitarString, Pitch, Ints, EitherProperty, MultiProperty, Note } from "./types"




/* Draw hammers
1. currentString: which guitar string this note is on
2. eProperties is the list of EitherProperties
3. fret is the fret of the current note (-1 if an X)
4. x location
5. yCoord: y location, calculated based on what string this note is on
6. isGrace: whether this note is a grace note
7. propertyList: used to keep track of properties that extend past lines or pages
RETURNS the hammer code and the updated propertyList
*/ 
function drawHammer(currentString: number, eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean, propertyList: PropertyList) : [ReactElement, PropertyList] {

  // TODO:
  return [<></>, propertyList]

}




/* Draw harmonics
1. eProperties is the list of EitherProperties
2. fret is the fret of the current note (-1 if an X)
3. x location
4. yCoord: y location, calculated based on what string this note is on
5. isGrace: whether this note is a grace note
RETURNS the harmonics code
*/ 
function drawHarmonics(eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean) : ReactElement {

  // TODO:
  return <></>

}




/* Draw parentheses
1. eProperties is the list of EitherProperties
2. fret is the fret of the current note (-1 if an X)
3. x location
4. yCoord: y location, calculated based on what string this note is on
5. isGrace: whether this note is a grace note
RETURNS the parens code
*/ 
function drawParens(eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean) : ReactElement {

  // TODO:
  return <></>

}




/* Draw a SlideDown
1. eProperties is the list of EitherProperties
2. fret is the fret of the current note (-1 if an X)
3. x location
4. yCoord: y location, calculated based on what string this note is on
5. isGrace: whether this note is a grace note
RETURNS the SlideDown code
*/ 
function drawSlideDown(eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean) : ReactElement {

  // TODO:
  return <></>

}




/* Draw a SlideUp
1. eProperties is the list of EitherProperties
2. fret is the fret of the current note (-1 if an X)
3. x location
4. yCoord: y location, calculated based on what string this note is on
5. isGrace: whether this note is a grace note
RETURNS the SlideUp code
*/ 
function drawSlideUp(eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean) : ReactElement {

  // TODO:
  return <></>

}




/* Draw a tie
1. currentString is the guitar string of this note
2. eProperties is the list of EitherProperties
3. fret is the fret of the currrent note (-1 if an X)
4. x location
5. yCoord: y location, calculated based on what string this note is on
6. isGrace: whether this note is a grace note
7. propertyList: used to keep track of properties that extend past lines or pages
RETURNS the tie code and the updated propertyList
*/
function drawTie(currentString: number, eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean, propertyList: PropertyList) : [ReactElement, PropertyList] {

  // TODO:
  return [<></>, propertyList]

}





/* Draw a slide
1. currentString is the guitar string of this note
2. eProperties is the list of EitherProperties
3. fret is the fret of the currrent note (-1 if an X)
4. x location
5. yCoord: y location, calculated based on what string this note is on
6. isGrace: whether this note is a grace note
7. propertyList: used to keep track of properties that extend past lines or pages
RETURNS the slide code and the updated propertyList
*/
function drawSlide(currentString: number, eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean, propertyList: PropertyList) : [ReactElement, PropertyList] {

  // TODO:
  return [<></>, propertyList]

}





/* Draw all eitherProperties
1. currentString is the guitar string of this note
2. eProperties is the list of EitherProperties
3. fret is the fret of the currrent note (-1 if an X)
4. propertyList: used to keep track of properties that extend past lines or pages
5. isGrace: whether or not this note is a grace note
6. x location
7. y location
8. measureNumber for errors
RETURNS the code and the updated propertyList
*/
function drawEProperties(currentString: number, eProperties: EitherProperty[], fret: number, propertyList: PropertyList, isGrace: boolean, x: number, y: number, measureNumber: number) : [ReactElement, PropertyList] {
  
  let newPropertyList : PropertyList = {...propertyList}

  // TODO: this probably needs to be edited
  const yCoord = y - 2.3 + (6 * (currentString - 1))

  // Slides
  const slideResult = drawSlide(currentString, eProperties, fret, x, yCoord, isGrace, propertyList)
  newPropertyList = slideResult[1]

  // Ties
  const tieResult = drawTie(currentString, eProperties, fret, x, yCoord, isGrace, propertyList)
  newPropertyList = tieResult[1]

  // Slide up
  const slideUpResult = drawSlideUp(eProperties, fret, x, yCoord, isGrace)

  // Slide down
  const slideDownResult = drawSlideDown(eProperties, fret, x, yCoord, isGrace)

  // Parentheses
  const parensResult = drawParens(eProperties, fret, x, yCoord, isGrace)

  // Harmonics
  const harmonicsResult = drawHarmonics(eProperties, fret, x, yCoord, isGrace)

  // Hammers
  const hammerResult = drawHammer(currentString, eProperties, fret, x, yCoord, isGrace, propertyList)
  newPropertyList = hammerResult[1]

  const code = <>
    {slideResult[0]}
    {tieResult[0]}
    {slideUpResult}
    {slideDownResult}
    {parensResult}
    {harmonicsResult}
    {hammerResult[0]}
  </>

  return [code, newPropertyList]

}




/* Draw a LongPalmMute
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. propertyList: used to keep track of properties that extend past lines or pages
6. measureNumber: used for errors
RETURNS the LongPalmMute code and the updated propertyList
*/
function drawLongPalmMute(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], propertyList: PropertyList, measureNumber: number) : [ReactElement, PropertyList] {

  //TODO:
  return [<></>, propertyList]

}




/* Draw a PalmMute
1. x location
2. y location
3. mProperties: list of multiProperties attached to this note
RETURNS the PalmMute code
*/
function drawPalmMute(x: number, y: number, mProperties: MultiProperty[]) : ReactElement {

  //TODO:
  return <></>

}





/* Draw a pluckDown
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. bottomString: the lowest string in this element
6. topString: the highest string in this element
RETURNS the pluckDown code 
*/
function drawPluckDown(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], bottomString: number, topString: number) : ReactElement {

  // TODO:
  return <></>

}





/* Draw a pluckUp
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. bottomString: the lowest string in this element
6. topString: the highest string in this element
RETURNS the pluckUp code 
*/
function drawPluckUp(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], bottomString: number, topString: number) : ReactElement {

  // Check to see if the pluck up property exists
  const plu = mProperties.includes("plu")

  if (plu) {

    // Calculate the height of the pluck based on the number of strings it traverses
    const height = topString - bottomString + 1
    const start = bottomString * 6

    let pluckCode : ReactElement = <></>

    if (isGrace) {

      x -= 1.5
      y = y + 3.5 - start
      let yArrow = y - ((height - 1) * 6) + 0.3

      // Draw a curve for each unit of height, aka for each guitar string there is one curve
      const heightMap = Array.from(Array(height).keys())

      pluckCode = <>
        {heightMap.map(i => {

          // Calculate the starting position for the curve
          let newY = y - ((i-1) * 6)

          return <path key={i} className="pluck" d={
            `M ${x} ${newY} 
            C ${x - 0.7} ${newY - 1}, ${x - 0.7} ${newY - 1.5}, ${x} ${newY - 3}
            C ${x + 1.3} ${newY - 4}, ${x + 1.3} ${newY - 4.5}, ${x} ${newY - 6}
            C ${x - 0.1} ${newY - 6.1}, ${x - 0.3} ${newY - 5.85}, ${x - 0.2} ${newY - 5.7}
            C ${x + 0.07} ${newY - 5.2}, ${x + 0.07} ${newY - 4.8}, ${x - 0.3} ${newY - 4}
            C ${x - 1.6} ${newY - 2.3}, ${x - 1.6} ${newY - 2.2}, ${x - 0.2} ${newY + 0.3}
            C ${x - 0.1} ${newY + 0.4}, ${x + 0.07} ${newY + 0.15}, ${x} ${newY}`
          } />
        })}
        {
          <path className="pluck" d={`M ${x} ${yArrow} l 1.5 0 l -1.5 -3 l -1.5 3 l 1.5 0`} />
        }
      </>

    } else {

      x -= 2.2
      y = y + 3.5 - start
      let yArrow = y - ((height - 1) * 6) + 0.3

      // Draw a curve for each unit of height, aka for each guitar string there is one curve
      const heightMap = Array.from(Array(height).keys())

      pluckCode = <>
        {heightMap.map(i => {

          // Calculate the starting position for the curve
          let newY = y - ((i-1) * 6)

          return <path key={i} className="pluck" d={
            `M ${x} ${newY} 
            C ${x - 1} ${newY - 1}, ${x - 1} ${newY - 1.5}, ${x} ${newY - 3}
            C ${x + 1.5} ${newY - 4}, ${x + 1.5} ${newY - 4.5}, ${x} ${newY - 6}
            C ${x - 0.15} ${newY - 6.1}, ${x - 0.4} ${newY - 5.85}, ${x - 0.3} ${newY - 5.7}
            C ${x + 0.1} ${newY - 5.2}, ${x + 0.1} ${newY - 4.8}, ${x - 0.5} ${newY - 4}
            C ${x - 2.3} ${newY - 2.3}, ${x - 2.3} ${newY - 2.2}, ${x - 0.3} ${newY + 0.3}
            C ${x - 0.15} ${newY + 0.4}, ${x + 0.1} ${newY + 0.15}, ${x} ${newY}`
          } />
        })}
        {
          <path className="pluck" d={`M ${x} ${yArrow} l 2 0 l -2 -4 l -2 4 l 2 0`} />
        }
      </>

    }

    return pluckCode

  } else {
    return <></>
  }

}





/* Draw a strumDown
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. bottomString: the lowest string in this element
6. topString: the highest string in this element
RETURNS the strumDown code 
*/
function drawStrumDown(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], bottomString: number, topString: number) : ReactElement {

  // Check to see if the strum down property exists
  const std = mProperties.includes("std")

  if (std) {

    // Calculate the height of the strum based on the number of strings it traverses
    const height = topString - bottomString + 1
    const start = bottomString * 6

    let strumCode : ReactElement = <></>

    if (isGrace) {

      x -= 1.5
      y = y + 8.3 - start
      let length = (height - 1) * 6 + 4

      strumCode = <path className="strum-grace" d={`M ${x} ${y - 0.5} l 0 -${length} M ${x} ${y - 0.3} l 0.8 0 l -0.8 2.3 l -0.8 -2.3 l 0.8 0`} />

    } else {

      x -= 2.2
      y = y + 8 - start
      let length = (height - 1) * 6 + 4.5
      
      strumCode = <path className="strum" d={`M ${x} ${y} l 0 -${length} M ${x} ${y} l 1.15 0 l -1.15 2.8 l -1.15 -2.8 l 1.15 0`} />

    }

    return strumCode

  } else {
    return <></>
  }

}


  



/* Draw a strumUp
1. isGrace: whether or not this note is a grace note
2. x location
3. y location
4. mProperties: list of multiProperties attached to this note
5. bottomString: the lowest string in this element
6. topString: the highest string in this element
RETURNS the strumUp code 
*/
function drawStrumUp(isGrace: boolean, x: number, y: number, mProperties: MultiProperty[], bottomString: number, topString: number) : ReactElement {

  // Check to see if the strum up property exists
  const stu = mProperties.includes("stu")

  if (stu) {

    // Calculate the height of the strum based on the number of strings it traverses
    const height = topString - bottomString + 1
    const start = bottomString * 6

    let strumCode : ReactElement = <></>

    if (isGrace) {

      x -= 1.5
      y = y + 8.5 - start
      let length = (height - 1) * 6 + 4

      strumCode = <path className="strum-grace" d={`M ${x} ${y - 0.5} l 0 -${length} M ${x} ${y - length + 0.2} l 0.8 0 l -0.8 -2.3 l -0.8 2.3 l 0.8 0`} />

    } else {

      x -= 2.2
      y = y + 8.5 - start
      let length = (height - 1) * 6 + 4.5
      
      strumCode = <path className="strum" d={`M ${x} ${y} l 0 -${length} M ${x} ${y - length + 0.2} l 1.15 0 l -1.15 -2.8 l -1.15 2.8 l 1.15 0`} />

    }

    return strumCode

  } else {
    return <></>
  }

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

  // Strum down
  const strumDownResult = drawStrumDown(isGrace, x, y, mProperties, bottomString, topString)

  // Pluck Up
  const pluckUpResult = drawPluckUp(isGrace, x, y, mProperties, bottomString, topString)

  // Pluck Down
  const pluckDownResult = drawPluckDown(isGrace, x, y, mProperties, bottomString, topString)

  // Palm Mute
  const palmMuteResult = drawPalmMute(x, y, mProperties)

  // Long palm mute
  const longPalmMuteResult = drawLongPalmMute(isGrace, x, y, mProperties, newPropertyList, measureNumber)
  newPropertyList = longPalmMuteResult[1]

  const code = <>
    {slurResult[0]}
    {strumUpResult}
    {strumDownResult}
    {pluckUpResult}
    {pluckDownResult}
    {palmMuteResult}
    {longPalmMuteResult[0]}
  </>

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
      let fret : number
      let eProperties : EitherProperty[]

      const note = noteInfo.note

      if (note.noteKind === "normalGuitarNote") {

        currentString = note.string
        fret = note.fret
        eProperties = note.eitherProperties

      } else {

        currentString = note.string
        fret = -1
        eProperties = note.eitherProperties

      }

      
      // Draw the mProperties
      const mResult = drawMProperties(noteInfo.multiProperties, newPropertyList, isGrace, currentX, currentY, currentString, currentString, measureNumber)

      mPropertiesCode = mResult[0]
      newPropertyList = mResult[1]

      // draw the eProperties
      const eResult = drawEProperties(currentString, eProperties, fret, newPropertyList, isGrace, currentX, currentY, measureNumber)

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
            let fret : number
            let eProperties : EitherProperty[]

            if (note.noteKind === "normalGuitarNote") {

              currentString = note.string
              fret = note.fret
              eProperties = note.eitherProperties

            } else {

              currentString = note.string
              fret = -1
              eProperties = note.eitherProperties

            }

            // draw the eProperties
            const eResult = drawEProperties(currentString, eProperties, fret, newPropertyList, isGrace, currentX, currentY, measureNumber)

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





function checkEndTie() {
//TODO:
}





function checkEndSlur() {
//TODO:
}





function checkEndMute() {
//TODO:
}





function checkEndHammer() {
//TODO:
}





function checkEndSlide() {
//TODO:
}





/* Check and draw any needed endings for line properties, if a property extends to the next line
*/
function checkLineEndings(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  // TODO:

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

  // TODO:
  // Check line endings
  // Check page endings if needed (check to see if last line)

  const result = <>
    {linesCode}
  </>

  return [result, newPropertyList]

}































//
