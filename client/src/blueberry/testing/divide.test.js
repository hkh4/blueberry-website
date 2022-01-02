const { parseSimple, parseComplex, parseGroup, parseTuplet } = require("./../score/divide")

// ************************* Note parsers


// **** parseSimple
const parseSimpleNote = [
  1,
  {
    "kind": "simple",
    "simpleKind": "singleSimple",
    "string": 1,
    "pitch": "e",
    "properties": ["gra", "har"]
  },
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
            "noteKind": "normalGuitarNote",
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



//****** parseComplex
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
                "noteKind": "normalGuitarNote",
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



// r8..
const parseComplexRest = [
  3,
  {
    "kind": "complex",
    "complexKind": "restComplex",
    "rhythm": [8,2]
  },
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



//***** parseGroup
// (1e/^ 2f/sli 3g#/tie/har)2/pld
const parseGroupNote = [
  6666666666,
  {
    "kind": "group",
    "groupKind": "groupComplex",
    "rhythm": [2,0],
    "notes": [
        {
            "string": 1,
            "pitch": "e",
            "eitherProperties": ["^"]
        },
        {
            "string": 2,
            "pitch": "f",
            "eitherProperties": ["sli"]
        },
        {
            "string": 3,
            "pitch": "g#",
            "eitherProperties": ["tie","har"]
        }
    ],
    "multiProperties": ["pld"]
  },
  false,
  {
    "time": [4,4],
    "key": "c",
    "capo": 0,
    "title": "Hi",
    "composer": "Me",
    "tuning": "standard",
    "tuningNumbers": [0,7,2,9,5,0]
  },
  [4,0]
]

const parseGroupNoteResult = [{
    "noteInfo": {
        "kind": "groupNote",
        "notes": [
            {
                "noteKind": "normalGuitarNote",
                "string": 1,
                "pitch": "e",
                "fret": 12,
                "eitherProperties": [
                    "^"
                ]
            },
            {
                "noteKind": "normalGuitarNote",
                "string": 2,
                "pitch": "f",
                "fret": 8,
                "eitherProperties": [
                    "sli"
                ]
            },
            {
                "noteKind": "normalGuitarNote",
                "string": 3,
                "pitch": "g#",
                "fret": 6,
                "eitherProperties": [
                    "tie",
                    "har"
                ]
            }
        ],
        "multiProperties": [
            "pld"
        ]
    },
    "duration": [
        2,
        0
    ],
    "start": 0,
    "width": 0,
    "lastNote": false,
    "location": [
        0,
        0
    ],
    "graceNotes": [],
    "comments": ""
}, false, [2,0]]

test('parseGroupNote', () => {
  expect(parseGroup(...parseGroupNote)).toEqual(parseGroupNoteResult)
})



// ****** parseTuplet

// <r>1
const singleRestTuplet = [
  1,
  {
    "kind": "tuplet",
    "notes": [
        {
            "kind": "simple",
            "simpleKind": "restSimple"
        }
    ],
    "rhythm": [1,0],
    "grace": false
  },
  true,
  {
    "time": [4,4],
    "key": "c",
    "capo": 0,
    "title": "Untitled",
    "composer": "Unknown",
    "tuning": "standard",
    "tuningNumbers": [0,7,2,9,5,0]
  },
  [4,0]
]

const singleRestTupletResult = [
    {
        "noteInfo": {
            "kind": "tupletNote",
            "notes": [
                {
                    "noteInfo": {
                        "kind": "rest"
                    },
                    "duration": [4,0],
                    "start": 0,
                    "width": 15.384615384615383,
                    "lastNote": false,
                    "location": [0,0],
                    "graceNotes": [],
                    "comments": ""
                }
            ]
        },
        "duration": [1,0],
        "start": 0,
        "width": 15.384615384615383,
        "lastNote": true,
        "location": [0,0],
        "graceNotes": [],
        "comments": ""
    },
    false,
    [1,0]
]

test('parseSingleRestTuplet', () => {
  expect(parseTuplet(...singleRestTuplet)).toEqual(singleRestTupletResult)
})










//
