const { parseSimple, parseComplex } = require("./../score/divide")

// ************************* Note parsers

const parseSimpleNote = [
  1,
  {
    "kind": "simple",
    "simpleKind": "singleSimple",
    "string": 1,
    "pitch": "e",
    "properties": ["gra", "har"]
  },
  4,
  4,
  false,
  {
    "time": [4,4],
    "key": "c",
    "capo": 1,
    "title": "Untitled",
    "composer": "Unknown",
    "tuning": "standard",
    "tuningNumbers": [0,7,2,9,5,0]
  },
  [4,0]
]

const parseSimpleNoteResult = [{
    "noteInfo": {
        "kind": "singleNote",
        "note": {
            "singleNoteKind": "normalGuitarNote",
            "string": 1,
            "pitch": "e",
            "fret": 11,
            "eitherProperties": ["har"]
        },
        "multiProperties": ["gra"]
    },
    "duration": [4, 0],
    "start": 0,
    "width": 0,
    "lastNote": false,
    "location": [0, 0],
    "graceNotes": [],
    "comments": ""
}, true]

test('parseSimpleNote', () => {
  expect(parseSimple(...parseSimpleNote)).toEqual(parseSimpleNoteResult)
})



const parseSimpleRest = [
  3,
  {
    "kind": "simple",
    "simpleKind": "restSimple"
  },
  8,
  3,
  true,
  {
    "time": [3,8],
    "key": "d",
    "capo": 6,
    "title": "Hi",
    "composer": "Me",
    "tuning": "standard",
    "tuningNumbers": [0,7,2,9,5,0]
  },
  [8,0]
]

const parseSimpleRestResult = [{
    "noteInfo": {
        "kind": "rest",
    },
    "duration": [8, 0],
    "start": 0,
    "width": 0,
    "lastNote": true,
    "location": [0, 0],
    "graceNotes": [],
    "comments": ""
}, false]

test('parseSimpleRest', () => {
  expect(parseSimple(...parseSimpleRest)).toEqual(parseSimpleRestResult)
})



const parseComplexNote = [
  3,
  {
    "kind": "complex",
    "complexKind": "singleComplex",
    "string": 2,
    "rhythm": [2,1],
    "pitch": "f",
    "properties": ["pld","sls","slu"]
  },
  4,
  3,
  false,
  {
    "time": [3,4],
    "key": "d",
    "capo": 0,
    "title": "Hi",
    "composer": "Me",
    "tuning": "standard",
    "tuningNumbers": [0,7,2,9,5,0]
  },
  [4,0]
]

const parseComplexNoteResult = [
    {
        "noteInfo": {
            "kind": "singleNote",
            "note": {
                "singleNoteKind": "normalGuitarNote",
                "string": 2,
                "pitch": "f#",
                "fret": 9,
                "eitherProperties": ["slu"]
            },
            "multiProperties": ["pld", "sls"]
        },
        "duration": [2,1],
        "start": 0,
        "width": 0,
        "lastNote": false,
        "location": [0,0],
        "graceNotes": [],
        "comments": ""
    },
    false,
    [2,1]
]

test('parseComplexNote', () => {
  expect(parseComplex(...parseComplexNote)).toEqual(parseComplexNoteResult)
})




const parseComplexRest = [
  3,
  {
    "kind": "complex",
    "complexKind": "restComplex",
    "rhythm": [8,2]
  },
  16,
  10,
  false,
  {
    "time": [10,16],
    "key": "f#",
    "capo": 12,
    "title": "Hi",
    "composer": "Me",
    "tuning": "something weird",
    "tuningNumbers": [0,4,2,9,5,0]
  },
  [16,0]
]

const parseComplexRestResult = [
    {
        "noteInfo": {
            "kind": "rest"
        },
        "duration": [8,2],
        "start": 0,
        "width": 0,
        "lastNote": false,
        "location": [0,0],
        "graceNotes": [],
        "comments": ""
    },
    false,
    [8,2]
]

test('parseComplexRest', () => {
  expect(parseComplex(...parseComplexRest)).toEqual(parseComplexRestResult)
})
















//
