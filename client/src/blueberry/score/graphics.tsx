import { Page } from "./types"



export function show(pages: Page[], tuningNumbers: number[]) {

  const svgs = pages.map((page, index) => {

    const x = <svg key={index} height="100" width="100" viewBox="0 0 200 200">
      <text x="50" y="50">One svg</text>
    </svg>

    return x
  })

  const result = <>
    {svgs.map(s => {
      return s
    })}
  </>

  return result

}












//
