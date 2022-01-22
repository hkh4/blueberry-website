import { Page, PropertyList, OptionsRecord, Line } from "./types"
import { paperWidth, paperHeight, firstLineWidth, otherLinesWidth } from "./constants"
import { Fragment } from "react"
import { style } from "./style"

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




/* Graphics for one line
1. line: line being shown
RETURNS jsx
*/
function showLine(line: Line) {

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

    <line style={{strokeWidth: "1px"}} x1={staffX + 3.1} y1={staffY - 26.3} x2={staffX + 8.6} y2={staffY - 26.3} />
    <line style={{strokeWidth: "1.1px"}} x1={staffX + 5.85} y1={staffY - 25.8} x2={staffX + 5.85} y2={staffY - 19.8} />

    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 2.6} ${staffY - 11.4} l 1.2 0 l 0.7 -2 l 2.8 0 l 0.7 2 l 1.2 0 l -2.7 -7 l -1.2 0 l -2.7 7`} />
    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 4.8} ${staffY - 14.3} l 2.2 0 l -1.1 -3.1 l -1.1 3.1`} fill="white" />

    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 3.5} ${staffY - 2.5} l 3.3 0 c 2.4 0 1.9 -3.7 0.9 -3.7 c 1 0 1.5 -3.7 -0.9 -3.7 l -3.3 0 l 0 7.4`} />
    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 4.5} ${staffY - 3.4} l 2.3 0 c 1 0 1 -2.3 0 -2.3 l -2.3 0 l 0 2.2`} fill="white" />
    <path style={{strokeWidth: "0.1px"}} d={`M ${staffX + 4.5} ${staffY - 6.7} l 2.3 0 c 1 0 1 -2.3 0 -2.3 l -2.3 0 l 0 2.2`} fill="white" />



  </>

  /*
  <line style={{strokeWidth: "1px"}} x1={200} y1={200} x2={205.5} y2={200} />
  <line style={{strokeWidth: "1.1px"}} x1={202.75} y1={200.5} x2={202.75} y2={206.5} />

  <path style={{strokeWidth: "0.1px"}} d={`M 199.5 214.9 l 1.2 0 l 0.7 -2 l 2.8 0 l 0.7 2 l 1.2 0 l -2.7 -7 l -1.2 0 l -2.7 7`} />
  <path style={{strokeWidth: "0.1px"}} d={`M 201.7 212 l 2.2 0 l -1.1 -3.1 l -1.1 3.1`} fill="white" />

  <path style={{strokeWidth: "0.1px"}} d={`M 200.4 223.3 l 3.3 0 c 2.4 0 1.9 -3.7 0.9 -3.7 c 1 0 1.5 -3.7 -0.9 -3.7 l -3.3 0 l 0 7.4`} />
  <path style={{strokeWidth: "0.1px"}} d={`M 201.4 222.4 l 2.3 0 c 1 0 1 -2.3 0 -2.3 l -2.3 0 l 0 2.2`} fill="white" />
  <path style={{strokeWidth: "0.1px"}} d={`M 201.4 219.1 l 2.3 0 c 1 0 1 -2.3 0 -2.3 l -2.3 0 l 0 2.2`} fill="white" />
  */

  return <>
    {staffLines}
    {clefAndTimeSignature}
  </>

}




/* Graphics for one page
1. page: the page being shown
2. optionsR: optionsRecord to display, if needed
RETURNS svg for this page
*/
function showPage(page: Page, optionsR: OptionsRecord) {

  const lines : Line[] = page.lines
  const pageNumber: number = page.pageNumber


  if (pageNumber === 1) {

    return <svg viewBox={`0 0 ${paperWidth} ${paperHeight}`}>

      <style>{style}</style>

      <text x="306" y="47" textAnchor="middle" className="title">{optionsR.title}</text>
      <text x="565" y="72" textAnchor="end" className="composer">{optionsR.composer}</text>
      <text x="40" y="72" textAnchor="start" className="capo">{`capo ${optionsR.capo}`}</text>
      <text x="40" y="87" textAnchor="start" className="tuning">{`Tuning: ${optionsR.tuning}`}</text>

      {lines.map((line, index) => {
        return <Fragment key={index}>
          {showLine(line)}
        </Fragment>
      })}

    </svg>
  } else {

    return <svg viewBox={`0 0 ${paperWidth} ${paperHeight}`}>
      <style>{style}</style>
      {lines.map((line, index) => {
        return <Fragment key={index}>
          {showLine(line)}
        </Fragment>
      })}
    </svg>

  }


}




/* Graphics driver
1. pages
2. optionsRecord: all the starting options info to be displayed
RETURNS all the svgs
*/
export function show(pages: Page[], optionsR: OptionsRecord) {

  const result = <Fragment>

    {pages.map((page, index) => {
      return <Fragment key={index}>
        {showPage(page, optionsR)}
      </Fragment>
    })}

  </Fragment>

  return result


}












//
