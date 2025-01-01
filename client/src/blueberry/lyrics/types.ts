export type GuitarString = 1 | 2 | 3 | 4 | 5 | 6

export type Barre = {
  kind: "barre",
  strings: GuitarString[],
  fret: Number
}

export type Dot = {
  kind: "dot",
  string: GuitarString,
  fret: Number 
}

export type X = {
  kind: "x",
  string: GuitarString
}

export type Note = Barre | Dot | X

export type Chart = {
  title: string,
  notes: Note[]
}

export type Line = string

export type Page = {
  pageNumber: number,
  lines: Line[]
}

export type ScoreOption = {
  option: string,
  value: string
}

export type OptionsRecord = {
  capo: string,
  title: string,
  composer: string,
  tuningString: string,
  tuning: [string, string, string, string, string, string]
}