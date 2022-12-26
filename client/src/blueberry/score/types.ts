// ******* Helpers
export type Ints = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
 
// function to check if an integer is an "ints"
export function isInts(i: Ints | number) : i is Ints {
  return ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].includes(i))
}

// ******* Pitch
export type Pitch = "a" | "a#" | "ab" | "an" | "b" | "b#" | "bb" | "bn" | "c" | "c#" | "cb" | "cn" | "d" | "d#" | "db" | "dn" | "e" | "e#" | "eb" | "en" | "f" | "f#" | "fb" | "fn" | "g" | "g#" | "gb" | "gn" | "nopitch"

export type Key = "c" | "cm" | "c#" | "c#m" | "cb" | "d" | "dm" | "db" | "d#m" | "e" | "em" | "eb" | "ebm" | "f" | "fm" | "f#" | "f#m" | "g" | "gm" | "gb" | "g#m" | "a" | "am" | "ab" | "abm" | "a#m" | "b" | "bm" | "bb" | "bbm"

// function to check if a string is a Pitch
export function isPitch(p: Pitch | string): p is Pitch {
  return ["a", "a#", "ab", "an", "b", "b#", "bb", "bn", "c", "c#", "cb", "cn", "d", "d#", "db", "dn", "e", "e#", "eb", "en", "f", "f#", "fb", "fn", "g", "g#", "gb", "gn", "nopitch"].includes(p)
}

// function to check if a string is a Key
export function isKey(k: Key | string) : k is Key {
  return ["c", "cm", "c#", "c#m", "cb", "d", "dm", "db", "d#m", "e", "em", "eb", "ebm", "f", "fm", "f#", "f#m", "g", "gm", "gb", "g#m", "a", "am", "ab", "abm", "a#m", "b", "bm", "bb", "bbm"].includes(k)
}

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

export type Rhythm = [RhythmNumber, number] | "norhythm"

// check if it's [RhythmNumber, number]
export function isRhythmNumberNumber(r: [RhythmNumber, number] | "norhythm") : r is [RhythmNumber, number] {
  return (r !== "norhythm")
}


// check if number is a rhythmnumber
export function isRhythmNumber(r: RhythmNumber | number) : r is RhythmNumber {
  return ([0, 1, 2, 4, 8, 16, 32, 64].includes(r))
}


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
  notes: ParserNote[],
  rhythm: Rhythm,
  grace: boolean
}

export type Comment = {
  kind: "comment",
  comment: string
}

// NOTE: in this version, there are no hidden comments. They are just ignored when parsed

export type ParserNote = Simple | Complex | Group | Tuplet | Comment


// ******* Expr
export type ScoreOption = {
  kind: "scoreOption",
  option: string,
  value: string
}

export type ParserMeasure = {
  kind: "parserMeasure"
  measureNumber: number,
  notes: ParserNote[]
}

export type Expr = ScoreOption | ParserMeasure

// ****************************** Interpreter export types

export type OptionsRecord = {
  time: [number, RhythmNumber],
  key: Key,
  capo: Ints,
  title: string,
  composer: string,
  tuning: string,
  tuningNumbers: number[]
}

export type NormalGuitarNote = {
  noteKind: "normalGuitarNote",
  string: GuitarString,
  pitch: Pitch,
  fret: Ints,
  eitherProperties: EitherProperty[]
}

export type X = {
  noteKind: "x",
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
  newTime: [number, RhythmNumber]
}

export type Notehead = SingleNote | GroupNote | TupletNote | Rest | Barline | Empty | Buffer | TimeChange


export type Element = {
  noteInfo: Notehead,
  duration: Rhythm,
  start: number,
  width: number,
  lastNote: boolean,
  location: [number, number],
  graceNotes: Element[],
  comments: string
}

export type Measure = {
  key: Key,
  time: [number, RhythmNumber],
  capo: Ints,
  measureNumber: number,
  elements: Element[],
  width: number,
  changes: {
    time: boolean,
    key: boolean,
    capo: boolean
  }
}

export type Line = {
  lineNumber: number,
  measures: Measure[],
  originalWidth: number,
  finalWidth: number,
  start: [number, number]
}

export type Page = {
  pageNumber: number,
  lines: Line[]
}

export type PropertyList = {
  // (x,y),grace note,valid
  slurStart: [[number, number], boolean, boolean],
  // (x,y),valid
  muteStart: [[number, number], boolean],
  // string: (x,y),fret,grace,valid
  tieStart: {
    s1: [[number, number], number, boolean, boolean],
    s2: [[number, number], number, boolean, boolean],
    s3: [[number, number], number, boolean, boolean],
    s4: [[number, number], number, boolean, boolean],
    s5: [[number, number], number, boolean, boolean],
    s6: [[number, number], number, boolean, boolean]
  },
  slideStart: {
    s1: [[number, number], number, boolean, boolean],
    s2: [[number, number], number, boolean, boolean],
    s3: [[number, number], number, boolean, boolean],
    s4: [[number, number], number, boolean, boolean],
    s5: [[number, number], number, boolean, boolean],
    s6: [[number, number], number, boolean, boolean]
  },
  slideStubs: {
    s1: [[number, number], number, boolean, boolean],
    s2: [[number, number], number, boolean, boolean],
    s3: [[number, number], number, boolean, boolean],
    s4: [[number, number], number, boolean, boolean],
    s5: [[number, number], number, boolean, boolean],
    s6: [[number, number], number, boolean, boolean]
  },
  hammerStart: {
    s1: [[number, number], number, boolean, boolean],
    s2: [[number, number], number, boolean, boolean],
    s3: [[number, number], number, boolean, boolean],
    s4: [[number, number], number, boolean, boolean],
    s5: [[number, number], number, boolean, boolean],
    s6: [[number, number], number, boolean, boolean]
  }
}











//
