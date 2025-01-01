import { OptionsRecord, Chart, Line } from "./types"
import { Fragment, ReactElement } from "react"
import { style } from "./style"
import { defs } from "./svgDefs"
import { PAPERHEIGHT, PAPERWIDTH } from "./constants"


/* Create code for a chart
1. chart: Chart object to be drawn
2. tuning: string tuning option to be written into the chart
3. x location
4. y location
RETURNS chart code and new x,y coordinates
*/
function showChart(chart: Chart, tuning: [string, string, string, string, string, string], x: number, y: number) : [ReactElement, number, number] {
  
  const code = <>
    <use href="#chart-line" x={x} y={x} />
  </>

  return [code, x, y]

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
    <text x="40" y="87" textAnchor="start" className="tuning">{`Tuning: ${optionsR.tuning}`}</text>
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

  // Draw charts
  let chartCodes : ReactElement[] = []
  let x = 40
  let y = 100
  charts.forEach(c => {

    let chartCode: ReactElement
    let newX: number 
    let newY: number
    [chartCode, newX, newY] = showChart(c, optionsR.tuning, x, y)
    chartCodes.push(chartCode)

  })

  const svg = <svg viewBox={`0 0 ${PAPERWIDTH} ${PAPERHEIGHT}`}>
    <style>{style}</style>
    {defs}
    {optionsCode}
    {
      chartCodes.map((c,i) => {
        return <Fragment key={i}>
          {c}
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