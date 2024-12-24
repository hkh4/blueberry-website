import { Measure, Buffer, Element, Empty, Barline, Pitch, RhythmNumber } from "./types"

// ************ CONSTANT VALUES

// ******* Widths
export const emptyElementWidth = 8

export const timeChangeWidth = 7.0

export const repeatWidth = 3.0

export const minimumLastWidth = 11.0

export const tupletWidthReduction = 1.3

const emptyMeasureRestWidth = 30


// ******** Graphics consts
export const paperWidth = 612

export const paperHeight = 792

export const firstLineWidth = 495

export const otherLinesWidth = 515

export const firstPageLineStart = 147

export const otherPagesLineStart = 97

export const lastPossibleLineStart = 732

export const heightBetweenLines = 75

export const firstLineX = 70

export const otherLinesX = 50

export const lineEndX = 565

export const firstLineBuffer = 30

export const otherLinesBuffer = 20



// ************* Measure elements

export const emptyMeasureWidth = emptyMeasureRestWidth + emptyElementWidth

const empty : Empty = {
  kind: "empty"
}

export const defaultElement : Element = {
  noteInfo: empty,
  duration: "norhythm",
  start: 0.0,
  width: 0,
  lastNote: false,
  location: [0.0, 0.0],
  graceNotes: [],
  comments: ""
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

const fullRest : Element = {
  noteInfo: {
    kind: "rest"
  },
  duration: [0,0],
  start: 0.0,
  width: 30.0,
  lastNote: true,
  location: [0.0,0.0],
  graceNotes: [],
  comments: ""
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

export const emptyMeasure : Measure = {
  key: "c",
  time: [4,4],
  capo: 0,
  measureNumber: 0,
  elements: [emptyElement, fullRest, barlineElement],
  width: emptyMeasureWidth,
  changes: {
    time: false,
    key: false,
    capo: false
  }
}



// ***************** Key change object
// constants to force type, just to be safe
const asharp : Pitch = "a#"
const bsharp : Pitch = "b#"
const csharp : Pitch = "c#"
const dsharp : Pitch = "d#"
const esharp : Pitch = "e#"
const fsharp : Pitch = "f#"
const gsharp : Pitch = "g#"

const aflat : Pitch = "ab"
const bflat : Pitch = "bb"
const cflat : Pitch = "cb"
const dflat : Pitch = "db"
const eflat : Pitch = "eb"
const fflat : Pitch = "fb"
const gflat : Pitch = "gb"

export const keyChange = {
  "cb": {
    "a": aflat,
    "b": bflat,
    "c": cflat,
    "d": dflat,
    "e": eflat,
    "f": fflat,
    "g": gflat
  },
  "abm": {
    "a": aflat,
    "b": bflat,
    "c": cflat,
    "d": dflat,
    "e": eflat,
    "f": fflat,
    "g": gflat
  },
  "c": {},
  "am": {},
  "c#": {
    "c": csharp,
    "d": dsharp,
    "e": esharp,
    "f": fsharp,
    "g": gsharp,
    "a": asharp,
    "b": bsharp
  },
  "a#m": {
    "c": csharp,
    "d": dsharp,
    "e": esharp,
    "f": fsharp,
    "g": gsharp,
    "a": asharp,
    "b": bsharp
  },
  "db": {
    "d": dflat,
    "e": eflat,
    "g": gflat,
    "a": aflat,
    "b": bflat
  },
  "bbm": {
    "d": dflat,
    "e": eflat,
    "g": gflat,
    "a": aflat,
    "b": bflat
  },
  "d": {
    "f": fsharp,
    "c": csharp
  },
  "bm": {
    "f": fsharp,
    "c": csharp
  },
  "eb": {
    "e": eflat,
    "a": aflat,
    "b": bflat
  },
  "cm": {
    "e": eflat,
    "a": aflat,
    "b": bflat
  },
  "e": {
    "f": fsharp,
    "g": gsharp,
    "c": csharp,
    "d": dsharp
  },
  "c#m": {
    "f": fsharp,
    "g": gsharp,
    "c": csharp,
    "d": dsharp
  },
  "f": {
    "b": bflat
  },
  "dm": {
    "b": bflat
  },
  "f#": {
    "f": fsharp,
    "g": gsharp,
    "a": asharp,
    "c": csharp,
    "d": dsharp,
    "e": esharp
  },
  "d#m": {
    "f": fsharp,
    "g": gsharp,
    "a": asharp,
    "c": csharp,
    "d": dsharp,
    "e": esharp
  },
  "gb": {
    "g": gflat,
    "a": aflat,
    "b": bflat,
    "c": cflat,
    "d": dflat,
    "e": eflat
  },
  "ebm": {
    "g": gflat,
    "a": aflat,
    "b": bflat,
    "c": cflat,
    "d": dflat,
    "e": eflat
  },
  "g": {
    "f": fsharp
  },
  "em": {
    "f": fsharp
  },
  "ab": {
    "a": aflat,
    "b": bflat,
    "d": dflat,
    "e": eflat
  },
  "fm": {
    "a": aflat,
    "b": bflat,
    "d": dflat,
    "e": eflat
  },
  "a": {
    "c": csharp,
    "f": fsharp,
    "g": gsharp
  },
  "f#m": {
    "c": csharp,
    "f": fsharp,
    "g": gsharp
  },
  "bb": {
    "b": bflat,
    "e": eflat
  },
  "gm": {
    "b": bflat,
    "e": eflat
  },
  "b": {
    "c": csharp,
    "d": dsharp,
    "f": fsharp,
    "g": gsharp,
    "a": asharp
  },
  "g#m": {
    "c": csharp,
    "d": dsharp,
    "f": fsharp,
    "g": gsharp,
    "a": asharp
  }
}


// ************* Widths and rhythms

export const widths = {
  '0,0': 30.0,
  '1,3': 80.0,
  '1,2': 69.0,
  '1,1': 58.0,
  '1,0': 48.5,
  '2,3': 43.5,
  '2,2': 40.2,
  '2,1': 36.8,
  '2,0': 32.5,
  '4,3': 30.3,
  '4,2': 27.5,
  '4,1': 25.2,
  '4,0': 22.0,
  '8,3': 20.3,
  '8,2': 18.7,
  '8,1': 17.0,
  '8,0': 15.4,
  '16,2': 13.8,
  '16,1': 12.7,
  '16,0': 11.5,
  '32,1': 10.0,
  '32,0': 9.5,
  '64,0': 8.3
}

export const graceWidths = {
  'norhythm': 0.0,
  '0,0': 0.0, // SHOULD NEVER HAPPEN
  '1,3': 22.5,
  '1,2': 19.5,
  '1,1': 17.5,
  '1,0': 15.5,
  '2,3': 13.5,
  '2,2': 12.5,
  '2,1': 11.5,
  '2,0': 10.5,
  '4,3': 9.5,
  '4,2': 9.0,
  '4,1': 8.5,
  '4,0': 8.0,
  '8,3': 7.5,
  '8,2': 7.1,
  '8,1': 6.8,
  '8,0': 6.5,
  '16,2': 6.2,
  '16,1': 6.0,
  '16,0': 5.8,
  '32,1': 5.6,
  '32,0': 5.5,
  '64,0': 5.4
}

const x1 : RhythmNumber = 1
const x2 : RhythmNumber = 2
const x4 : RhythmNumber = 4
const x8 : RhythmNumber = 8
const x16 : RhythmNumber = 16
const x32 : RhythmNumber = 32
const x64 : RhythmNumber = 64

export const arrayOfRhythms : RhythmNumber[] = [x1, x2, x4, x8, x16, x32, x64]

export const numberOfBeams = {
  8: 1,
  16: 2,
  32: 3,
  64: 4
}
















//
