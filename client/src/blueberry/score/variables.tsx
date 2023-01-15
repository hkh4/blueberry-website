import { Variable, AllVariables } from "./types"

// ******************** Evaluate variables

/* Turn a list of Variables into single AllVariables object that is easier to use and like a dictionary
1. variables: list of Variables from parser
RETURNS AllVariables object
*/
export function evalVariables(variables: Variable[]) : AllVariables {

  // Initialize AllVariables object
  let allVars : AllVariables = {}

  // Loop through the variables
  for (const v of variables) {
    
    // create new entry in object
    allVars[v.key] = v.replacement
  }

  return allVars

}