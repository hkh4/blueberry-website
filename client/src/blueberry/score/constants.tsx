import { Measure, Buffer, Element, Empty, Barline } from "./types"

// ************ CONSTANT VALUES

// ******* Widths
export const emptyElementWidth = 5.0

export const timeChangeWidth = 10.0



// ************* Measure elements
export const defaultMeasure : Measure = {
  key: "c",
  time: [4,4],
  capo: 0,
  measureNumber: 0,
  elements: [],
  width: 0.0,
  changes: {
    time: false,
    key: false,
    capo: false
  }
}

const buffer : Buffer = {
  kind: "buffer"
}

export const bufferElement : Element = {
  noteInfo: buffer,
  duration: "norhythm",
  start: 0.0,
  width: 0.0,
  lastNote: false,
  location: [0.0, 0.0],
  graceNotes: [],
  comments: ""
}

const empty : Empty = {
  kind: "empty"
}

export const emptyElement : Element = {
  noteInfo: empty,
  duration: "norhythm",
  start: 0.0,
  width: emptyElementWidth,
  lastNote: false,
  location: [0.0, 0.0],
  graceNotes: [],
  comments: ""
}

const barline : Barline = {
  kind: "barline"
}

export const barlineElement : Element = {
  noteInfo: barline,
  duration: "norhythm",
  start: 0.0,
  width: 0.0,
  lastNote: false,
  location: [0.0, 0.0],
  graceNotes: [],
  comments: ""
}
