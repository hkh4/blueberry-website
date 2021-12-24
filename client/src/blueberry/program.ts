import { grammar } from "./score/parser"

export default function main(programType: string, input: string) {

  try {

    if (programType === "score") {

      const result = grammar.tryParse(input)
      return result

    }

  } catch(e) {
    console.log(e)
  }
}


let input =
`-title Hugo
-composer Hugo
-time 4-4
-key f#

%test%
1:
  6x8../gra/slu
  1e
  %test%
  r4
  $hi$
  (3dn 4fb 6x/par)
  <1f#8/har 2dn4/par/sli/sls (4f#/sld 1x/har)16./gra/sle>32.

2:
  1e1

3:
  1e2

-key g#

%hi%
4:
  2f4.
  $lol$
  `
main("score", input)
