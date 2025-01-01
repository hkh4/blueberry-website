import { ReactElement } from "react"
import { ScoreOption, Chart, Line, OptionsRecord } from "./types"
import evalOptions from "./options"
import show from "./graphics"

export default function lyricInterpret(options: ScoreOption[], charts: Chart[], lines: Line[]) : ReactElement {

  const defaultOptions : OptionsRecord = {
    capo: "0",
    title: "Untitled",
    composer: "",
    tuningString: "Standard tuning",
    tuning: ["e", "a", "d", "g", "b", "e"]
  }

  // First, parse the options
  const optionsR = evalOptions(options, defaultOptions)

  // Then, do the graphics!
  const resultSVG = show(optionsR, charts, lines)

  return resultSVG
}