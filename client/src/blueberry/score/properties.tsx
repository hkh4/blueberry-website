import { ReactElement, Fragment } from "react"
import { PropertyList, Page, Line, Measure, Element, Notehead, GuitarString, Pitch, Ints, EitherProperty, MultiProperty, Note, PreviousPageCode } from "./types"




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

  let newPropertyList : PropertyList = {...propertyList}

  // Create the string used to access the property list
  const s = `s${currentString}`

  // Get the property list entry for tieStart
  const tieStart = propertyList.tieStart[s]

  let tieCode : ReactElement = <></>

  // Decompose into variables
  let [[oldX, oldY], oldFret, oldGrace, valid] = tieStart

  // Check if a tie start is needed
  if (valid) {

    // Set default coordinates
    let dx1 = oldX + 3.6
    let dx2 = x - 0.7
    let dy = yCoord - 3.5
    let mid = (dx2 - dx1) * 0.3
    let yRise = 2.1

    // Tweak coordinates based on whether one of the notes is a grace note, and if either fret is >= 10 
    if (oldGrace) {
      dx1 -= 0.8 
    }

    if (isGrace) {
      dx2 += 0.2
    }

    if (oldGrace && isGrace) { 
      dy += 0.3
      yRise -= 0.3
    }

    if (oldFret >= 10) {
      dx1 += 1.4
    }

    if (fret >= 10) {
      dx2 -= 1.7
    }

    tieCode = <path className="tie" d={`M ${dx1} ${dy} C ${dx1 + mid} ${dy - yRise}, ${dx2 - mid} ${dy - yRise}, ${dx2} ${dy}`} />

    // Reset tie stub
    newPropertyList.tieStart[s] = [[0, 0], 0, false, false]

  }

  // Check to see if this note wants a tie
  const tie = eProperties.includes("tie")

  if (tie) {
    // If a tie is on this note, update the property list
    newPropertyList.tieStart[s] = [[x, yCoord], fret, isGrace, true]
  }

  return [tieCode, newPropertyList]

}





/* Draw a slide
1. currentString is the guitar string of this note
2. eProperties is the list of EitherProperties
3. fret is the fret of the currrent note (-1 if an X)
4. x location
5. yCoord: y location, calculated based on what string this note is on
6. isGrace: whether this note is a grace note
7. propertyList: used to keep track of properties that extend past lines or pages
8. pageNumber: page number
9. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS the slide code, the updated propertyList, and the updated previousPageCode
*/
function drawSlide(currentString: number, eProperties: EitherProperty[], fret: number, x: number, yCoord: number, isGrace: boolean, propertyList: PropertyList, pageNumber: number, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {

  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}
  let slideCode : ReactElement = <></>

  // Create the string used to access the property list
  const s = `s${currentString}`

  // Get the propertyList elements for slides
  // SlideStart is for drawing a slide from a previous note to this note
  const slideStart = propertyList.slideStart[s]

  // SlideStub is for drawing a stub at the end of the LAST line. This needs to be done here because the direction of the stub (up/down) depends on the fret of this current note in relation to the note in the last line that requested a slide
  const slideStub = propertyList.slideStubs[s]

  let slideStartCode : ReactElement = <></>
  let slideStubCode : ReactElement = <></>

  // Decompose into variables
  let [[oldX, oldY], oldFret, oldGrace, valid] = slideStart

  // Check if a slidestart is needed
  if (valid) {

    // Figure out which direction the slide should go
    const direction : "up" | "down" = oldFret <= fret ? "up" : "down"

    // Set default x coordinates, which are the same for up and down slides
    let dx1 = oldX + 3.6
    let dx2 = x - 0.8
    let dy1;
    let dy2;

    // Set y coordinates, and tweak x and y coordinates, based on direction, grace notes, frets
    if (direction == "up") {
      
      // Set default starting and ending coordinates 
      dy1 = oldY - 0.7
      dy2 = yCoord - 3.8
      
      // Tweak the starting coordinates based on whether one of the notes is a grace note, or if a fret is >=10
      if (oldGrace) {
        dx1 -= 0.8
        dy1 -= 0.5
      }

      if (isGrace) {
        dx2 += 0.1
        dy2 += 0.4
      }

      if (oldFret >= 10) {
        dx1 += 1.3
      }

      if (fret >= 10) {
        dx2 -= 1.1
      }

    } else {

      // If direction is "down"
      // Same process as above, but slides go downwards instead of up

      // Set default starting and ending coordinates
      dy1 = oldY - 3.8
      dy2 = yCoord - 0.8 

      // Tweak the starting coordinates based on whether one of the notes is a grace note, or if a fret is >=10
      if (oldGrace) {
        dx1 -= 0.8
        dy1 += 0.5
      }

      if (isGrace) {
        dx2 += 0.1
        dy2 -= 0.4
      }

      if (oldFret >= 10) {
        dx1 += 0.7
      }

      if (fret >= 10) {
        dx2 -= 1.1
      }

    }

    // Draw the slide
    slideStartCode = <path className="slide" d={`M ${dx1} ${dy1} L ${dx2} ${dy2}`} />

    // Reset slide start 
    newPropertyList.slideStart[s] = [[0, 0], 0, false, false]

    // Draw a slide stub if needed
    if (slideStub[3]) {

      // NOTE that a slidestub should ONLY exist if a slidestart also exists, and properties should match

      // Decompose variables
      const [stubX, stubY] = slideStub[0]

      // Set coordinates and tweak if necessary. Instead of recalculating everything, do some math to remove oldX and oldY from above and replace with the new values
      dx1 = dx1 - oldX + stubX 
      dy1 = dy1 - oldY + stubY
      dx2 = dx1 + 12
      dy2 = dy2 - yCoord + stubY

      slideStubCode = <path className="slide" d={`M ${dx1} ${dy1} L ${dx2} ${dy2}`} />

      // Reset slide stub
      newPropertyList.slideStubs[s] = [[0, 0], 0, false, false]

      // If the slide stub is supposed to go onto the previous page, return it separately 
      // Check if the y coordinate of this note is smaller than the slide stub y coordinate
      if (yCoord < stubY) {

        const p = `p${pageNumber - 1}`

        // See if the previous page code object already has a property for this page in the format p1, p2 etc
        if (newPreviousPageCode.hasOwnProperty(p)) {
          newPreviousPageCode[p].push(slideStubCode)
        } else {
          newPreviousPageCode[p] = [slideStubCode]
        }

        return [slideStartCode, newPropertyList, newPreviousPageCode]
      }

    }
  } 

  // Check to see if this note wants a slide
  const sli = eProperties.includes("sli")

  if (sli) {
    // If a slide is on this note, update the property list
    newPropertyList.slideStart[s] = [[x, yCoord], fret, isGrace, true]
  }

  slideCode = <>
    {slideStartCode}
    {slideStubCode}
  </>

  return [slideCode, newPropertyList, newPreviousPageCode]

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
9. pageNumber: page number
10. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS the code, the updated propertyList, and the updated previous page code
*/
function drawEProperties(currentString: number, eProperties: EitherProperty[], fret: number, propertyList: PropertyList, isGrace: boolean, x: number, y: number, measureNumber: number, pageNumber: number, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {
  
  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}

  // TODO: this probably needs to be edited
  const yCoord = y + 2.3 - (6 * (currentString - 1))

  // Slides
  const slideResult = drawSlide(currentString, eProperties, fret, x, yCoord, isGrace, propertyList, pageNumber, newPreviousPageCode)
  newPropertyList = slideResult[1]
  newPreviousPageCode = slideResult[2]

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

  return [code, newPropertyList, newPreviousPageCode]

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

  let newPropertyList : PropertyList = {...propertyList}

  // Check to see if the beginning or end long palm mute properties exist
  const pl1 = mProperties.includes("pl1")
  const pl2 = mProperties.includes("pl2")

  if (pl1 && pl2) {
    // If a note has both a long palm mute start and long palm mute end, throw an error
    throw new Error(`Error in measure ${measureNumber}. Can't have a long palm mute start and end property on the same note.`)
  } else if (pl1) {

    // If a note only has a long palm mute start
    // Check if the muteStart property of the property list is valid. If so, throw an error due to overlapping mutes
    if (propertyList.muteStart[1]) {
      throw new Error(`Error in measure ${measureNumber}. Overlapping long palm mutes detected. A long palm mute must be ended before another one is started.`)
    }

    // Otherwise, update muteStart
    newPropertyList.muteStart = [[x,y], true]

    return [<></>, newPropertyList]

  } else if (pl2) {

    // If a note only has a long palm mute end
    // Check to see if there was a slur started
    if (propertyList.muteStart[1]) {

      // Further decompose into relevant properties
      let [oldX, oldY] = propertyList.muteStart[0]

      oldX += 8
      x += 1.6
      y += 7.8

      // Move the end a little to the left for grace notes
      if (isGrace) {
        x -= 0.2
      }

      // Figure out how many dashed lines are needed
      const counter = Math.floor((x - oldX) / 6)
      const counterMap = Array.from(Array(counter).keys())
      const xAfterDashes = oldX + (counter * 6)

      // Is an additional small line needed at the end?
      // If there is a space greater than 2, add a small extra line
      const remainder = x - xAfterDashes
      let needLine : boolean
      let extraLength : number

      if (remainder > 2) {
        needLine = true
        extraLength = Math.min(4, remainder - 2)
      } else {
        needLine = false
        extraLength = 0
      }

      // Draw the palm mute
      let muteCode : ReactElement = <>
        <text textAnchor="middle" x={`${oldX - 6}`} y={`${oldY + 10}`} className="palm-mute">PM</text>
        
        {counterMap.map(i => {
          return <path className="long-palm-mute" d={`M ${oldX + (i * 6)} ${y} l 4 0`} />
        })}

        {
          needLine && <path className="long-palm-mute" d={`M ${xAfterDashes} ${y} l ${extraLength} 0`} />
        }

        <path className="long-palm-mute" d={`M ${x} ${y} l 0 -3`} />
        
      </>

      newPropertyList.muteStart = [[0,0],false]

      return [muteCode, newPropertyList]

    } else {
      // no long palm mute started, throw error
      throw new Error(`Error in measure ${measureNumber}. Cannot end a long palm mute without starting one first.`)
    }

  } 

  return [<></>, propertyList]

}




/* Draw a PalmMute
1. x location
2. y location
3. mProperties: list of multiProperties attached to this note
RETURNS the PalmMute code
*/
function drawPalmMute(x: number, y: number, mProperties: MultiProperty[]) : ReactElement {

  // Check to see if the palm mute property exists
  const plm = mProperties.includes("plm")

  if (plm) {

    x += 2
    y += 10
    return <text textAnchor="middle" x={`${x}`} y={`${y}`} className="palm-mute">PM</text>

  } 
  
  return <></>

}





/* Helper method for pluckDown and pluckUp. Draws one iteration of the curve for regular notes
1. x location
2. y location
3. key for JSX mapping
RETURNS code for the curve
*/
function drawPluckCurve(x: number, y: number, key: number) : ReactElement {

  return <path key={key} className="pluck" d={
    `M ${x} ${y} 
    C ${x - 1} ${y - 1}, ${x - 1} ${y - 1.5}, ${x} ${y - 3}
    C ${x + 1.5} ${y - 4}, ${x + 1.5} ${y - 4.5}, ${x} ${y - 6}
    C ${x - 0.15} ${y - 6.1}, ${x - 0.4} ${y - 5.85}, ${x - 0.3} ${y - 5.7}
    C ${x + 0.1} ${y - 5.2}, ${x + 0.1} ${y - 4.8}, ${x - 0.5} ${y - 4}
    C ${x - 2.3} ${y - 2.3}, ${x - 2.3} ${y - 2.2}, ${x - 0.3} ${y + 0.3}
    C ${x - 0.15} ${y + 0.4}, ${x + 0.1} ${y + 0.15}, ${x} ${y}`
  } />

}




/* Helper method for pluckDown and pluckUp. Draws one iteration of the curve for grace notes
1. x location
2. y location
3. key for JSX mapping
RETURNS code for the curve
*/
function drawPluckCurveGrace(x: number, y: number, key: number) : ReactElement {

  return <path key={key} className="pluck" d={
    `M ${x} ${y} 
    C ${x - 0.7} ${y - 1}, ${x - 0.7} ${y - 1.5}, ${x} ${y - 3}
    C ${x + 1.3} ${y - 4}, ${x + 1.3} ${y - 4.5}, ${x} ${y - 6}
    C ${x - 0.1} ${y - 6.1}, ${x - 0.3} ${y - 5.85}, ${x - 0.2} ${y - 5.7}
    C ${x + 0.07} ${y - 5.2}, ${x + 0.07} ${y - 4.8}, ${x - 0.3} ${y - 4}
    C ${x - 1.6} ${y - 2.3}, ${x - 1.6} ${y - 2.2}, ${x - 0.2} ${y + 0.3}
    C ${x - 0.1} ${y + 0.4}, ${x + 0.07} ${y + 0.15}, ${x} ${y}`
  } />

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

  // Check to see if the pluck down property exists
  const pld = mProperties.includes("pld")

  if (pld) {

    // Calculate the height of the pluck based on the number of strings it traverses
    const height = topString - bottomString + 1
    const start = bottomString * 6

    let pluckCode : ReactElement = <></>

    if (isGrace) {

      x -= 1.5
      y = y + 2 - start

      // Draw a curve for each unit of height, aka for each guitar string there is one curve
      const heightMap = Array.from(Array(height).keys())

      pluckCode = <>
        {heightMap.map(i => {

          // Calculate the starting position for the curve
          let newY = y - ((i-1) * 6)

          // Call helper function to draw a curve
          return drawPluckCurveGrace(x, newY, i)
        })}
        {
          <path className="pluck" d={`M ${x - 0.2} ${y + 6} l 1.5 0 l -1.5 3 l -1.5 -3 l 1.5 0`} />
        }
      </>

    } else {

      x -= 2.2
      y = y + 2 - start
      let yArrow = y - ((height - 1) * 6) + 0.3

      // Draw a curve for each unit of height, aka for each guitar string there is one curve
      const heightMap = Array.from(Array(height).keys())

      pluckCode = <>
        {heightMap.map(i => {

          // Calculate the starting position for the curve
          let newY = y - ((i-1) * 6)

          // Call helper function to draw a curve
          return drawPluckCurve(x, newY, i)
        })}
        {
          <path className="pluck" d={`M ${x - 0.2} ${y + 6} l 2 0 l -2 4 l -2 -4 l 2 0`} />
        }
      </>

    }

    return pluckCode

  }

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

          // Call helper function to draw a curve
          return drawPluckCurveGrace(x, newY, i)
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

          // Call helper function to draw a curve
          return drawPluckCurve(x, newY, i)
        })}
        {
          <path className="pluck" d={`M ${x} ${yArrow} l 2 0 l -2 -4 l -2 4 l 2 0`} />
        }
      </>

    }

    return pluckCode

  } 

  return <></>

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

  }

  return <></>

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

  } 

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
    } 

    // Update the slur start
    newPropertyList.slurStart = [[x,y], isGrace, true]

    return [<></>, newPropertyList]

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
5. pageNumber: page number
6. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS the code, the updated propertyList, and the updated previous page code
*/
function drawPropertiesElement(el: Element, propertyList: PropertyList, isGrace: boolean, measureNumber: number, pageNumber: number, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {

  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}
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
      const eResult = drawEProperties(currentString, eProperties, fret, newPropertyList, isGrace, currentX, currentY, measureNumber, pageNumber, newPreviousPageCode)

      ePropertiesCode = eResult[0]
      newPropertyList = eResult[1]
      newPreviousPageCode = eResult[2]

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
            const eResult = drawEProperties(currentString, eProperties, fret, newPropertyList, isGrace, currentX, currentY, measureNumber, pageNumber, newPreviousPageCode)

            newPropertyList = eResult[1]
            newPreviousPageCode = eResult[2]

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

            const r = drawPropertiesElement(note, newPropertyList, isGrace, measureNumber, pageNumber, newPreviousPageCode)

            newPropertyList = r[1]
            newPreviousPageCode = r[2]

            return r[0]
          })
        }
      </>

      return [allResult, newPropertyList, newPreviousPageCode]
    }

  }

  const result = <>
  {mPropertiesCode}
  {ePropertiesCode}
  </>

  return [result, newPropertyList, newPreviousPageCode]

}





/* Helper to draw the properties of a group of grace notes
1. els: list of grace notes
2. propertyList: used to keep track of properties that extend past lines or pages
3. measureNumber for error messages
4. pageNumber: page number
5. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS the code, the updated propertyList, and the updated previous page code
*/
function drawPropertiesElementGrace(els: Element[], propertyList: PropertyList, measureNumber: number, pageNumber: number, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {

  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}

  let graceCode : ReactElement = <></>

  const result = <>
    {
      els.map((el, index) => {

        [graceCode, newPropertyList, newPreviousPageCode] = drawPropertiesElement(el, newPropertyList, true, measureNumber, pageNumber, newPreviousPageCode)

        return <Fragment key={index}>
          {graceCode}
        </Fragment>

      })
    }
  </>

  return [result, newPropertyList, newPreviousPageCode]

}





/* Draw properties for a measure
1. elements: the elements of the measure, whose properties will be drawn
2. propertyList: used to keep track of properties that extend past lines or pages
3. measureNumber: for errors
4. pageNumber: page number
5. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS the measure's property code, the updated propertylist, and the updated previous page code
*/
function drawPropertiesMeasure(elements: Element[], propertyList: PropertyList, measureNumber: number, pageNumber: number, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {

  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}

  let elementCode : ReactElement = <></>
  let elementGraceCode : ReactElement = <></>

  const elementsCode = <>

    {
      elements.map((el, index) => {

        const noteInfo : Notehead = el.noteInfo

        // If it's a tupletNote, just recurse on each note within
        if (noteInfo.kind === "tupletNote") {
          [elementCode, newPropertyList, newPreviousPageCode] = drawPropertiesMeasure(noteInfo.notes, newPropertyList, measureNumber, pageNumber, newPreviousPageCode)

        } else {

          // Draw the properties of each grace note
          const result = drawPropertiesElementGrace(el.graceNotes, newPropertyList, measureNumber, pageNumber, newPreviousPageCode)
          elementGraceCode = result[0]
          newPropertyList = result[1]
          newPreviousPageCode = result[2]

          // Draw the properties of the notes themselves
          const result2 = drawPropertiesElement(el, newPropertyList, false, measureNumber, pageNumber, newPreviousPageCode)
          elementCode = result2[0]
          newPropertyList = result2[1]
          newPreviousPageCode = result2[2]

        }

        return <Fragment key={index}>
          {elementCode}
          {elementGraceCode}
        </Fragment>

      })
    }

  </>

  return [elementsCode, newPropertyList, newPreviousPageCode]

}





/* Check and draw any needed endings for ties
1. nextLine: either the next line on the same page, or the first line on the next page
2. propertyList: used to keep track of properties that extend past lines or pages
RETURNS tie ending code, and the updated property list
*/
function checkEndTie(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}
  let tieCode : ReactElement = <></>

  // Loop through each item in tieStart
  for (const s in propertyList.tieStart) {

    // Decompose variables
    let [[x, y], fret, grace, valid] = propertyList.tieStart[s]

    // The number of the guitar string
    const currentString = parseInt(s.slice(1))

    // Check if this tiestart is valid
    if (valid) {

      // Draw a stub for the tie
      x += 3.6
      y -= 3.5
      const x2 = x + 12
      const mid = (x2 - x) * 0.3
      const yRise = 2.1
      tieCode = <path className="tie" d={`M ${x} ${y} C ${x + mid} ${y - yRise}, ${x2 - mid} ${y - yRise}, ${x2} ${y}`} />

      // Get the next start valud of the next line
      let [nextX, nextY] = nextLine.start
      nextX += 8
      nextY = nextY + 2.3 - (6 * (currentString - 1))

      // Update the property list
      newPropertyList.tieStart[s] = [[nextX, nextY], fret, grace, true]

    }

  }


  return [tieCode, newPropertyList]
}





/* Check and draw any needed endings for slurs
1. nextLine: either the next line on the same page, or the first line on the next page
2. propertyList: used to keep track of properties that extend past lines or pages
RETURNS slur ending code, and the updated property list
*/
function checkEndSlur(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // TODO:
  return [<></>, newPropertyList]
}





/* Check and draw any needed endings for mutes
1. nextLine: either the next line on the same page, or the first line on the next page
2. propertyList: used to keep track of properties that extend past lines or pages
RETURNS mute ending code, and the updated property list
*/
function checkEndMute(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // TODO:
  return [<></>, newPropertyList]
}





/* Check and draw any needed endings for hammers
1. nextLine: either the next line on the same page, or the first line on the next page
2. propertyList: used to keep track of properties that extend past lines or pages
RETURNS hammer ending code, and the updated property list
*/
function checkEndHammer(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // TODO:
  return [<></>, newPropertyList]
}





/* Check and draw any needed endings for slides
1. nextLine: either the next line on the same page, or the first line on the next page
2. propertyList: used to keep track of properties that extend past lines or pages
RETURNS slide ending code, and the updated property list
*/
function checkEndSlide(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // Loop through each item in slideStart
  for (const s in propertyList.slideStart) {

    // Decompose variables
    const [[x, y], fret, grace, valid] = propertyList.slideStart[s]

    // The number of the guitar string
    const currentString = parseInt(s.slice(1))

    // Check if this slidestart is valid
    if (valid) {

      // Get the start value of the next line, and tweak them a bit
      let [nextX, nextY] = nextLine.start
      nextX += 8
      nextY = nextY + 2.3 - (6 * (currentString - 1))

      // Update the property list
      newPropertyList.slideStart[s] = [[nextX, nextY], fret, grace, true]

      // Update slide stubs
      newPropertyList.slideStubs[s] = [[x, y], fret, grace, true]

    }

  }

  return [<></>, newPropertyList]
  
}





/* Check and draw any needed endings for line and page properties, if a property extends to the next line/page
1. nextLine: either the next line on the same page, or the first line on the next page
2. propertyList: used to keep track of properties that extend past lines or pages
RETURNS all endings code, and the updated property list
*/
export function checkEndings(nextLine: Line, propertyList: PropertyList) : [ReactElement, PropertyList] {

  let newPropertyList : PropertyList = {...propertyList}

  // Slide endings
  const slideResult = checkEndSlide(nextLine, newPropertyList)
  newPropertyList = slideResult[1]

  // Hammer endings
  const hammerResult = checkEndHammer(nextLine, newPropertyList)
  newPropertyList = hammerResult[1]

  // Mute endings
  const muteResult = checkEndMute(nextLine, newPropertyList)
  newPropertyList = muteResult[1]

  // Slur endings
  const slurResult = checkEndSlur(nextLine, newPropertyList)
  newPropertyList = slurResult[1]

  // Tie endings
  const tieResult = checkEndTie(nextLine, newPropertyList)
  newPropertyList = tieResult[1]

  const code : ReactElement = <>
    {slideResult[0]}
    {hammerResult[0]}
    {muteResult[0]}
    {slurResult[0]}
    {tieResult[0]}
  </>

  return [code, newPropertyList]

}





/* Draw properties for a line
1. line: the line whose properties will be drawn
2. propertyList: used to keep track of properties that extend past lines or pages
3. pageNumber: page number
4. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS code for the properties of the line, the updated property list, and the updated previous page code
*/
function drawPropertiesLine(line: Line, propertyList: PropertyList, pageNumber: number, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {

  const measures : Measure[] = line.measures
  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}

  let measureCode : ReactElement = <></>

  const measuresCode = <>

    {
      measures.map((measure, index) => {

        [measureCode, newPropertyList, newPreviousPageCode] = drawPropertiesMeasure(measure.elements, newPropertyList, measure.measureNumber, pageNumber, newPreviousPageCode)

        return <Fragment key={index}>
          {measureCode}
        </Fragment>

      })
    }

  </>

  return [measuresCode, newPropertyList, newPreviousPageCode]

}





/* Driver for drawing properties
1. page: the page whose properties will all be drawn
2. propertyList: used to keep track of properties that extend past lines or pages
3. previousPageCode: object that keeps track of code that needs to be inserted into a specific page
RETURNS the code for the page's properties, the updated property list, and the updated previous page code
*/
export function drawProperties(page: Page, propertyList: PropertyList, previousPageCode: PreviousPageCode) : [ReactElement, PropertyList, PreviousPageCode] {

  const lines : Line[] = page.lines
  let newPropertyList : PropertyList = {...propertyList}
  let newPreviousPageCode : PreviousPageCode = {...previousPageCode}

  let lineCode : ReactElement = <></>

  const linesCode = <>

    {
      lines.map((line, index) => {

        [lineCode, newPropertyList, newPreviousPageCode] = drawPropertiesLine(line, newPropertyList, page.pageNumber, newPreviousPageCode)
        {/* Check endings */}
        let lineEndCode : ReactElement = <></>
        if (index < lines.length - 1) {
          const endingsResult = checkEndings(lines[index + 1], newPropertyList)
          newPropertyList = endingsResult[1]
          lineEndCode = endingsResult[0]
        }


        return <Fragment key={index}>
          {lineCode}
          {lineEndCode}
        </Fragment>

      })
    }

  </>


  const result = <>
    {linesCode}
  </>

  return [result, newPropertyList, newPreviousPageCode]

}































//
