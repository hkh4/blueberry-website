const P = require("parsimmon")

export const word = P.takeWhile(input => {
  const notAllowed = [' ', '\n', '\r', '\t', '\r\n']
  return !notAllowed.includes(input)
})
  .desc("a word")

export const singleSpace = P.string(" ")
export const spaces = P.alt(P.string(" "), P.string("\t"), P.string("\n"), P.string("\r"), P.string("\r\n")).many()
  .desc("spaces or newlines")
export const regularSpace = P.alt(P.string(" "), P.string("\t"))
  .desc("a space")
export const emptySpaces = regularSpace.many()
  .desc("empty spaces")
export const emptySpaces1 = regularSpace.atLeast(1)
  .desc("empty spaces")
export const spacesAndNewline = emptySpaces.skip(P.newline)
  .desc("spaces and a newline")
export const emptyLines = spacesAndNewline.many()
  .desc("empty lines")

export const restOfLine = P.takeWhile(input => {
  return (input !== '\n' && input !== '\r' && input !== '\r\n')
}).map((r: string) => {
  return r.trim()
})

// Only allow strings 1-6
export const stringNum = P.test((c: string) => {
  return ["1", "2", "3", "4", "5", "6"].includes(c)
})
  .map(Number)
  .desc("1, 2, 3, 4, 5 or 6 to indicate which string of the guitar")

// Digits but minimum one
export const digits = P.regex(/[0-9]+/)