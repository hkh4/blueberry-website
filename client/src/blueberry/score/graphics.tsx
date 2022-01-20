import { Page, PropertyList, OptionsRecord } from "./types"



function showPage() {

}



/* Graphics driver
1. pages
2. optionsRecord: all the starting options info to be displayed
*/
export function show(pages: Page[], optionsR: OptionsRecord) {

  const defaultPropertyList : PropertyList = {
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

  const result = <svg viewBox="0 0 612 792">

    <text x="306" y="47" textAnchor="middle" className="title">{optionsR.title}</text>

    {pages.map((page, index) => {
      return showPage()
    })}

  </svg>

  return result


}












//
