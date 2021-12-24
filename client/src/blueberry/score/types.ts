// ******* Helpers
export type Ints = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

// ******* Pitch
export type Pitch = "a" | "a#" | "ab" | "an" | "b" | "b#" | "bb" | "bn" | "c" | "c#" | "cb" | "cn" | "d" | "d#" | "db" | "dn" | "e" | "e#" | "eb" | "en" | "f" | "f#" | "fb" | "fn" | "g" | "g#" | "gb" | "gn" | "nopitch"

export type Key = "c" | "cm" | "c#" | "c#m" | "cb" | "d" | "dm" | "db" | "d#m" | "e" | "em" | "eb" | "ebm" | "f" | "fm" | "f#" | "f#m" | "g" | "gm" | "gb" | "g#m" | "a" | "am" | "ab" | "abm" | "a#m" | "b" | "bm" | "bb" | "bbm"


// ******* Properties
export type MultiProperty = "gra" | "stu" | "std" | "plu" | "pld" | "sls" | "sle" | "plm" | "pl1" | "pl2"

export type EitherProperty = "par" | "sld" | "sli" | "slu" | "tie" | "har" | "^" | "ham"

export type Property = MultiProperty | EitherProperty

// function to check if a property is a Multiproperty
export function isMulti(p: MultiProperty | EitherProperty) : p is MultiProperty {
  const possibilities = ["gra", "stu", "std", "plu", "pld", "sls", "sle", "plm", "pl1", "pl2"]
  return possibilities.includes(p)
}

// function to check if a property is an EitherProperty
export function isEither(p: MultiProperty | EitherProperty) : p is EitherProperty {
  const possibilities = ["par", "sld", "sli", "slu", "tie", "har", "^", "ham"]
  return possibilities.includes(p)
}


// ******* Rhythm
export type RhythmNumber = 0 | 1 | 2 | 4 | 8 | 16 | 32 | 64

export type Rhythm = [RhythmNumber, Number] | "norhythm"


// ******* Notes
export type GuitarString = 1 | 2 | 3 | 4 | 5 | 6

export type Simple = SingleSimple | RestSimple

export type SingleSimple = {
  kind: "simple",
  simpleKind: "singleSimple",
  string: GuitarString,
  pitch: Pitch,
  properties: Property[]
}

export type RestSimple = {
  kind: "simple",
  simpleKind: "restSimple"
}

export type Complex = SingleComplex | RestComplex

export type SingleComplex = {
  kind: "complex",
  complexKind: "singleComplex",
  string: GuitarString,
  rhythm: Rhythm,
  pitch: Pitch,
  properties: Property[]
}

export type RestComplex = {
  kind: "complex",
  complexKind: "restComplex",
  rhythm: Rhythm
}

export type Group = GroupSimple | GroupComplex

export type GroupSimple = {
  kind: "group",
  groupKind: "groupSimple",
  notes: GNote[],
  multiProperties: MultiProperty[]
}

export type GroupComplex = {
  kind: "group",
  groupKind: "groupComplex",
  rhythm: Rhythm,
  notes: GNote[],
  multiProperties: MultiProperty[]
}

export type GNote = {
  string: GuitarString,
  pitch: Pitch,
  eitherProperties: EitherProperty[]
}

export type Tuplet = {
  kind: "tuplet"
  notes: Note[],
  rhythm: Rhythm
}

export type Comment = {
  kind: "comment",
  comment: String
}

export type HiddenComment = {
  kind: "hiddenComment"
}

export type ParserNote = Simple | Complex | Group | Tuplet | Comment | HiddenComment


// ******* Expr
export type ScoreOption = {
  option: String,
  value: String
}

export type ParserMeasure = {
  measureNumber: Number,
  notes: ParserNote[]
}

export type Expr = ScoreOption | ParserMeasure

// ****************************** Interpreter export types

export type optionsRecord = {
  time: [RhythmNumber, Number],
  key: Key,
  capo: Ints,
  title: String,
  composer: String,
  tuning: String,
  tuningNumber: Number[]
}

export type NormalGuitarNote = {
  singleNoteKind: "normalGuitarNote",
  string: GuitarString,
  pitch: Pitch,
  fret: Ints,
  eitherProperties: EitherProperty[]
}

export type X = {
  singleNoteKind: "x",
  string: GuitarString,
  eitherProperties: EitherProperty[]
}

export type Note = NormalGuitarNote | X

export type SingleNote = {
  kind: "singleNote",
  note: Note,
  multiProperties: MultiProperty[]
}

export type GroupNote = {
  kind: "groupNote",
  notes: Note[],
  multiProperties: MultiProperty[]
}

export type TupletNote = {
  kind: "tupletNote",
  notes: Element[]
}

export type Rest = {
  kind: "rest"
}

export type Barline = {
  kind: "barline"
}

export type Empty = {
  kind: "empty"
}

export type Buffer = {
  kind: "buffer"
}

export type TimeChange = {
  kind: "timeChange",
  newTime: [Number, Number]
}

export type Notehead = SingleNote | GroupNote | TupletNote | Rest | Barline | Empty | Buffer | TimeChange

export type Element = {
  noteInfo: Notehead,
  duration: Rhythm,
  start: Number,
  width: Number,
  lastNote: Number,
  location: [Number, Number],
  graceNotes: Element[],
  comments: String
}

export type Measure = {
  key: Key,
  time: Rhythm,
  capo: Ints,
  measureNumber: Number,
  elements: Element[],
  width: Number,
  changes: {
    time: Boolean,
    key: Boolean,
    capo: Boolean
  }
}

export type Line = {
  lineNumber: Number,
  measures: Measure[],
  originalWidth: Number,
  finalWidth: Number,
  type: String,
  start: [Number, Number]
}

export type Page = {
  pageNumber: Number,
  lines: Line[]
}
