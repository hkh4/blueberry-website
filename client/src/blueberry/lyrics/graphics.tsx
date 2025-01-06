import { OptionsRecord, Chart, Line, Note } from "./types"
import { Fragment, ReactElement } from "react"
import { style } from "./style"
import { defs } from "./svgDefs"
import { PAPERHEIGHT, PAPERWIDTH, XSTART, XEND, YEND, YSTART1, YSTART2, CHART_X_DIFF, CHART_Y_DIFF } from "./constants"


/* Remove any items at the end of the line list that are empty
*/
function removeEmptylines(lines: Line[]) : Line[] {

  let i = lines.length - 1

  while (i >= 0 && lines[i].trim() === "") {
    i--
  }

  return lines.slice(0, i+1)

}



/* Figures out the range of frets in a chart, and what the lowest fret is
notes: the barres, xs and dots in a chart
RETURNS the lowest fret, and the fret range
*/
function checkFretRange(notes: Note[]) : [number, number] {

  const allFrets : number[] = []

  notes.forEach(n => {
    if ("fret" in n) {
      allFrets.push(n.fret)
    } 
  })

  const maxFret = Math.max(...allFrets)
  const minFret = Math.min(...allFrets)

  return [minFret, maxFret - minFret]

}




/* Create code for a chart
1. chart: Chart object to be drawn
2. tuning: string tuning option to be written into the chart
3. x location
4. y location
RETURNS chart code and new x,y coordinates
*/
function showChart(chart: Chart, tuning: [string, string, string, string, string, string], x: number, y: number) : [ReactElement, number, number] {
  
  const linesCode = <>
    <use href="#chart-line" x={x} y={y} />
    <use href="#chart-line" x={x} y={y+10} />
    <use href="#chart-line" x={x} y={y+20} />
    <use href="#chart-line" x={x} y={y+30} />
    <use href="#chart-line" x={x} y={y+40} />
    <use href="#chart-line" x={x} y={y+50} />
    <use href="#chart-line-down" x={x} y={y} />
    <use href="#chart-line-down" x={x+10} y={y} />
    <use href="#chart-line-down" x={x+20} y={y} />
    <use href="#chart-line-down" x={x+30} y={y} />
    <use href="#chart-line-down" x={x+40} y={y} />
    <use href="#chart-line-down" x={x+50} y={y} />
  </>


  /* ----------------------------- Write the title ---------------------------- */
  const titleCode = <>
    <text x={x+25} y={y+70} textAnchor="middle" className="chart-title">{chart.title}</text>
  </>

  /* -------------------------- Write tuning letters -------------------------- */
  const tuningCode = <>
    {
      tuning.map((t, i) => {
        return <Fragment key={i}>
          <text x={x + (i * 10)} y={y+59} textAnchor="middle" className="chart-tuning">{t}</text>
        </Fragment>
      })
    }
  </>

  /* ----------------------------- Write the notes ---------------------------- */

  // First, check the range of the frets. If the range is > 4, throw an error
  const [minFret, fretRange] = checkFretRange(chart.notes)
  
  if (fretRange > 4) {
    throw new Error("Error in chart! The max difference between the lowest and highest fret in a chart is 4.")
  }

  const noteCode : ReactElement[] = []
  let stringsCovered : Number[] = []
  let barreFlag = false

  chart.notes.forEach(n => {

    switch (n.kind) {

      case "barre":

        // Figure out which strings are being used
        const [s1, s2] = n.strings
        const stringsUsed = Array.from({ length: s2 - s1 + 1 }, (_, i) => s1 + i)
        stringsCovered = [...stringsCovered, ...stringsUsed]

        const barreCode = <>
          <line className="chart-barre" 
            x1={x + ((s1-1) * 10)} 
            x2={x + ((s2-1) * 10)}
            y1={y + ((n.fret - minFret + 1) * 10) - 5}
            y2={y + ((n.fret - minFret + 1) * 10) - 5}
          />
        </>

        // If the barre is on fret one string one, flag it, since the fret marker will need to be moved slightly left
        if (s1 === 1 && (n.fret - minFret) === 0) {
          barreFlag = true
        }

        noteCode.push(barreCode)
        break;

      case "dot":
        stringsCovered.push(n.string)

        const dotCode = <>
          <use href="#chart-circle-filled" x={x + ((n.string-1) * 10)} y={y + ((n.fret - minFret + 1) * 10) - 5} />
        </>
        noteCode.push(dotCode)
        break;

      case "x":
        stringsCovered.push(n.string)

        const xCode = <>
          <use href="#chart-x" x={x + ((n.string - 1) * 10)} y={y-6} />
        </>

        noteCode.push(xCode)
        break;  

    }

  })

  // Figure out which strings are open
  const stringsOpen = [1,2,3,4,5,6].filter(s => !stringsCovered.includes(s))

  // Write code for open strings
  stringsOpen.forEach(n => {

    const openCode = <>
      <use href="#chart-circle-open" x={x + ((n-1) * 10)} y={y-6} />
    </>

    noteCode.push(openCode)

  })

  // Write the fret number
  const fretX = barreFlag ? (x-8) : (x-6)
  const fretCode = <>
    <text x={fretX} y={y + 8} className="chart-fret" textAnchor="middle">{minFret}</text>
  </>

  // Increment x and y. First, increase x. If it goes off the page, increment y instead. 
  let newX = x + CHART_X_DIFF
  let newY = y
  if (newX > XEND) {
    newX = XSTART 
    newY = y + CHART_Y_DIFF
  }

  let final = <>
    {linesCode}
    {titleCode}
    {tuningCode}
    {noteCode.map((n,i) => {
      return <Fragment key={i}>
        {n}
      </Fragment>
    })}
    {fretCode}
  </>
  

  return [final, newX, newY]

}



function showLyrics(line: Line, x: number, y: number) : [ReactElement, number, number] {

  // If the line is empty, just put in some space
  if (line.trim() === "") {

    y += 20
    return [<></>, x, y]

  }

  // Get the indices of all the slashes
  const regex = /\//g;
  const slashes = [...line.matchAll(regex)].map(s => s.index)

  // If there is an odd number of slashes, throw an error
  if (slashes.length % 2 !== 0) {
    throw new Error(`Error in this line: "${line}." Make sure there is an even number of slashes.`)
  }

  // First, create and write the text without the slashes
  const textRegex = /\/[^\/]*\//g // matches slash, then 0+ characters that are anything EXCEPT slash, followed by another slash
  const plainText = line.replace(textRegex, "")

  const plainTextCode = <>
    <text className="lyric-line" x={x} y={y + 13}>{plainText}</text>
  </>

  let chordCodes : ReactElement[] = []

  //Loop through slashes and draw each chord
  for (let i = 0; i < (slashes.length); i+=2) {
    
    // Get the chord item
    const i1 = slashes?.[i] || 0 // optional chaining to get rid of TS "undefined" error
    const i2 = slashes[i+1]
    const chord = line.slice(i1 + 1, i2)
    
    // Everything up until the first slash, but without previous slashes
    let others = line.slice(0, i1)
    others = others.replace(textRegex, "")
    
    // Put them together, with the "others" being invisible
    const chordCode = <>
      <text x={x} y={y} className="lyric-chord">
        <tspan fill="transparent" fontSize="12px">{others}</tspan>
        <tspan fill="black" fontSize="10px" fontWeight="bold">{chord}</tspan>
      </text>
    </>

    chordCodes.push(chordCode)

  }

  const finalCode = <>
    {plainTextCode}
    {chordCodes.map((c, i) => {
      return <Fragment key={i}>
        {c}
      </Fragment>
    })}
  </>

  y += 30

  return [finalCode, x, y]

}




/* Create code for options
1. optionsR: OptionsRecord objects holding the parsed score options
RETURNS fragment of options code that will go into the top of the first svg
*/
function showOptions(optionsR: OptionsRecord) : ReactElement {

  const optionsCode = <>
    <text x="306" y="47" textAnchor="middle" className="title">{optionsR.title}</text>
    <text x="565" y="72" textAnchor="end" className="composer">{optionsR.composer}</text>
    <text x="40" y="72" textAnchor="start" className="capo">{`capo ${optionsR.capo}`}</text>
    <text x="40" y="87" textAnchor="start" className="tuning">{`Tuning: ${optionsR.tuningString}`}</text>
  </>

  return optionsCode

}




/* Driver for graphics
1. optionsR: OptionsRecord objects holding the parsed score options
2. charts: list of charts to draw
3. lines: lines of lyrics
RETURNS svgs
*/
export default function show(optionsR: OptionsRecord, charts: Chart[], lines: Line[]) : ReactElement {

  let svgs : ReactElement[] = []
  let pageNumber = 1

  // Draw the options
  const optionsCode = showOptions(optionsR)

  /* ------------------------------- Draw charts ------------------------------ */
  let chartCodes : ReactElement[] = []
  let x = XSTART
  let y = YSTART1
  charts.forEach(c => {

    let chartCode: ReactElement
    let newX: number 
    let newY: number
    [chartCode, newX, newY] = showChart(c, optionsR.tuning, x, y)
    chartCodes.push(chartCode)
    x = newX 
    y = newY

    // If y is past endY, start a new page
    if (y > YEND) {
      const svg = <svg viewBox={`0 0 ${PAPERWIDTH} ${PAPERHEIGHT}`}>
        <style>{style}</style>
        {defs}
        {pageNumber === 1 && optionsCode}
        {
          chartCodes.map((c,i) => {
            return <Fragment key={i}>
              {c}
            </Fragment>
          })
        }
      </svg>

      svgs.push(svg)
      pageNumber++
      y = YSTART2
      chartCodes = []
    }
  })


  /* ------------------------------- Draw lyrics ------------------------------ */

  let lineCodes : ReactElement[] = []

  // Adjust coordinates
  x = XSTART
  y = y + 110
  if (y > YEND) {
    y = YSTART2
  }
  
  // Remove empty lines at the end, so there aren't unneeded empty pages
  lines = removeEmptylines(lines)

  lines.forEach(l => {

    let lineCode : ReactElement
    let newX : number 
    let newY : number 
    [lineCode, newX, newY] = showLyrics(l, x, y)


    lineCodes.push(lineCode)
    x = newX
    y = newY

    // If past YEND, start a new page
    if (y > YEND) {
      const svg = <svg viewBox={`0 0 ${PAPERWIDTH} ${PAPERHEIGHT}`}>
        <style>{style}</style>
        {defs}
        {pageNumber === 1 && optionsCode}
        {
          chartCodes.length > 0 && chartCodes.map((c,i) => {
            return <Fragment key={i}>
              {c}
            </Fragment>
          })
        }
        {
          lineCodes.map((l, i) => {
            return <Fragment key={i}>
              {l}
            </Fragment>
          })
        }
      </svg>

      svgs.push(svg)
      pageNumber++
      y = YSTART2
      chartCodes = []
      lineCodes = []
    }

  })


  // Whatever is leftover
  const svg = <svg viewBox={`0 0 ${PAPERWIDTH} ${PAPERHEIGHT}`}>
    <style>{style}</style>
    {defs}
    {pageNumber === 1 && optionsCode}
    {
      chartCodes.length > 0 && chartCodes.map((c,i) => {
        return <Fragment key={i}>
          {c}
        </Fragment>
      })
    }
    {
      lineCodes.length > 0 && lineCodes.map((l, i) => {
        return <Fragment key={i}>
          {l}
        </Fragment>
      })
    }
  </svg>

  svgs.push(svg)

  /*
  Loop through first the charts, then the lines, drawing them as they go.
  At any point if they start to exceed to length of a page, start a new one
  */



  let final : ReactElement = <>
    {
      svgs.map((s, i) => {
        return <Fragment key={i}>
          {s}
        </Fragment>
      })
    }
  </>

  // let final : ReactElement = <>
  //   {
  //     svgs.map((s, i) => {
  //       return <svg key={i} viewBox={`0 0 ${paperWidth} ${paperHeight}`}>
  //         {s}
  //       </svg>
  //     })
  //   }
  // </>

  return final
}