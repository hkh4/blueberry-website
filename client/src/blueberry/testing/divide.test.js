const { parseSimple, parseComplex, parseGroup, parseTuplet, evalMeasure } = require("../tabs/divide")

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
                    "width": 16.923076923076923,
                    "lastNote": false,
                    "location": [0,0],
                    "graceNotes": [],
                    "comments": ""
                }
            ]
        },
        "duration": [1,0],
        "start": 0,
        "width": 16.923076923076923,
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


// Slightly more complex tuplet, still no grace notes though
const moreComplexTuplet = [
  1,
  {
    "kind": "tuplet",
    "notes": [
        {
            "kind": "group",
            "groupKind": "groupSimple",
            "notes": [
                {
                    "string": 2,
                    "pitch": "nopitch",
                    "eitherProperties": []
                },
                {
                    "string": 4,
                    "pitch": "e",
                    "eitherProperties": [
                        "har"
                    ]
                }
            ],
            "multiProperties": [
                "pld"
            ]
        },
        {
            "kind": "simple",
            "simpleKind": "singleSimple",
            "string": 6,
            "pitch": "f#",
            "properties": []
        },
        {
            "kind": "complex",
            "complexKind": "singleComplex",
            "string": 5,
            "rhythm": [
                16,
                0
            ],
            "pitch": "g",
            "properties": [
                "^"
            ]
        }
    ],
    "rhythm": [
        4,
        0
    ],
    "grace": false
  },
  true,
  {
    "time": [
        3,
        8
    ],
    "key": "c",
    "capo": 0,
    "title": "Untitled",
    "composer": "Unknown",
    "tuning": "standard",
    "tuningNumbers": [
        0,
        7,
        2,
        9,
        5,
        0
    ]
  },
  [8,0]
]

const moreComplexTupletResult = [
    {
        "noteInfo": {
            "kind": "tupletNote",
            "notes": [
                {
                    "noteInfo": {
                        "kind": "groupNote",
                        "notes": [
                            {
                                "noteKind": "x",
                                "string": 2,
                                "eitherProperties": []
                            },
                            {
                                "noteKind": "normalGuitarNote",
                                "string": 4,
                                "pitch": "e",
                                "fret": 9,
                                "eitherProperties": [
                                    "har"
                                ]
                            }
                        ],
                        "multiProperties": [
                            "pld"
                        ]
                    },
                    "duration": [
                        8,
                        0
                    ],
                    "start": 0,
                    "width": 10.769230769230768,
                    "lastNote": false,
                    "location": [
                        0,
                        0
                    ],
                    "graceNotes": [],
                    "comments": ""
                },
                {
                    "noteInfo": {
                        "kind": "singleNote",
                        "note": {
                            "noteKind": "normalGuitarNote",
                            "string": 6,
                            "pitch": "f#",
                            "fret": 2,
                            "eitherProperties": []
                        },
                        "multiProperties": []
                    },
                    "duration": [
                        8,
                        0
                    ],
                    "start": 0,
                    "width": 10.769230769230768,
                    "lastNote": false,
                    "location": [
                        0,
                        0
                    ],
                    "graceNotes": [],
                    "comments": ""
                },
                {
                    "noteInfo": {
                        "kind": "singleNote",
                        "note": {
                            "noteKind": "normalGuitarNote",
                            "string": 5,
                            "pitch": "g",
                            "fret": 20,
                            "eitherProperties": [
                                "^"
                            ]
                        },
                        "multiProperties": []
                    },
                    "duration": [
                        16,
                        0
                    ],
                    "start": 0,
                    "width": 13,
                    "lastNote": false,
                    "location": [
                        0,
                        0
                    ],
                    "graceNotes": [],
                    "comments": ""
                }
            ]
        },
        "duration": [
            4,
            0
        ],
        "start": 0,
        "width": 34.53846153846153,
        "lastNote": true,
        "location": [
            0,
            0
        ],
        "graceNotes": [],
        "comments": ""
    },
    false,
    [
        4,
        0
    ]
]

test('parseMoreComplexTuplet', () => {
  expect(parseTuplet(...moreComplexTuplet)).toEqual(moreComplexTupletResult)
})


// grace note within tuplet
// <1e/har (1x 4fn/^)/gra 1e/sld>4
const graceWithinTuplet = [
  1,
  {
    "kind": "tuplet",
    "notes": [
        {
            "kind": "simple",
            "simpleKind": "singleSimple",
            "string": 1,
            "pitch": "e",
            "properties": [
                "har"
            ]
        },
        {
            "kind": "group",
            "groupKind": "groupSimple",
            "notes": [
                {
                    "string": 1,
                    "pitch": "nopitch",
                    "eitherProperties": []
                },
                {
                    "string": 4,
                    "pitch": "fn",
                    "eitherProperties": [
                        "^"
                    ]
                }
            ],
            "multiProperties": [
                "gra"
            ]
        },
        {
            "kind": "simple",
            "simpleKind": "singleSimple",
            "string": 1,
            "pitch": "e",
            "properties": [
                "sld"
            ]
        }
    ],
    "rhythm": [
        4,
        0
    ],
    "grace": false
  },
  false,
  {
    "time": [
        2,
        4
    ],
    "key": "cb",
    "capo": 1,
    "title": "Untitled",
    "composer": "Unknown",
    "tuning": "standard",
    "tuningNumbers": [
        0,
        7,
        2,
        9,
        5,
        0
    ]
  },
  [4,0]
]

const graceWithinTupletResult = [
    {
        "noteInfo": {
            "kind": "tupletNote",
            "notes": [
                {
                    "noteInfo": {
                        "kind": "singleNote",
                        "note": {
                            "noteKind": "normalGuitarNote",
                            "string": 1,
                            "pitch": "eb",
                            "fret": 10,
                            "eitherProperties": [
                                "har"
                            ]
                        },
                        "multiProperties": []
                    },
                    "duration": [
                        4,
                        0
                    ],
                    "start": 0,
                    "width": 15.384615384615383,
                    "lastNote": false,
                    "location": [
                        0,
                        0
                    ],
                    "graceNotes": [],
                    "comments": ""
                },
                {
                    "noteInfo": {
                        "kind": "singleNote",
                        "note": {
                            "noteKind": "normalGuitarNote",
                            "string": 1,
                            "pitch": "eb",
                            "fret": 10,
                            "eitherProperties": [
                                "sld"
                            ]
                        },
                        "multiProperties": []
                    },
                    "duration": [
                        4,
                        0
                    ],
                    "start": 0,
                    "width": 23.384615384615383,
                    "lastNote": false,
                    "location": [
                        0,
                        0
                    ],
                    "graceNotes": [
                        {
                            "noteInfo": {
                                "kind": "groupNote",
                                "notes": [
                                    {
                                        "noteKind": "x",
                                        "string": 1,
                                        "eitherProperties": []
                                    },
                                    {
                                        "noteKind": "normalGuitarNote",
                                        "string": 4,
                                        "pitch": "fn",
                                        "fret": 21,
                                        "eitherProperties": [
                                            "^"
                                        ]
                                    }
                                ],
                                "multiProperties": [
                                    "gra"
                                ]
                            },
                            "duration": [
                                4,
                                0
                            ],
                            "start": 0,
                            "width": 8,
                            "lastNote": false,
                            "location": [
                                0,
                                0
                            ],
                            "graceNotes": [],
                            "comments": ""
                        },
                        {
                            "noteInfo": {
                                "kind": "buffer"
                            },
                            "duration": "norhythm",
                            "start": 0,
                            "width": 0,
                            "lastNote": false,
                            "location": [
                                0,
                                0
                            ],
                            "graceNotes": [],
                            "comments": ""
                        }
                    ],
                    "comments": ""
                }
            ]
        },
        "duration": [
            4,
            0
        ],
        "start": 0,
        "width": 38.76923076923077,
        "lastNote": false,
        "location": [
            0,
            0
        ],
        "graceNotes": [],
        "comments": ""
    },
    false,
    [
        4,
        0
    ]
]

test('parseGraceWithinTuplet', () => {
  expect(parseTuplet(...graceWithinTuplet)).toEqual(graceWithinTupletResult)
})




//******* Test entire measure

const complexMeasure = [
  {
    "kind": "parserMeasure",
    "measureNumber": "1",
    "notes": [
        {
            "kind": "simple",
            "simpleKind": "singleSimple",
            "string": 5,
            "pitch": "nopitch",
            "properties": [
                "sls"
            ]
        },
        {
            "kind": "group",
            "groupKind": "groupComplex",
            "rhythm": [
                8,
                1
            ],
            "notes": [
                {
                    "string": 6,
                    "pitch": "f",
                    "eitherProperties": []
                },
                {
                    "string": 3,
                    "pitch": "gn",
                    "eitherProperties": [
                        "har"
                    ]
                },
                {
                    "string": 1,
                    "pitch": "nopitch",
                    "eitherProperties": []
                }
            ],
            "multiProperties": []
        },
        {
            "kind": "tuplet",
            "notes": [
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 1,
                    "rhythm": [
                        32,
                        0
                    ],
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 4,
                    "rhythm": [
                        64,
                        0
                    ],
                    "pitch": "gb",
                    "properties": [
                        "ham",
                        "gra"
                    ]
                },
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 2,
                    "rhythm": [
                        32,
                        0
                    ],
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 3,
                    "pitch": "e",
                    "properties": []
                }
            ],
            "rhythm": [
                16,
                0
            ],
            "grace": false
        },
        {
            "kind": "complex",
            "complexKind": "singleComplex",
            "string": 2,
            "rhythm": [
                8,
                0
            ],
            "pitch": "d#",
            "properties": [
                "par",
                "gra"
            ]
        },
        {
            "kind": "tuplet",
            "notes": [
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 2,
                    "pitch": "f",
                    "properties": []
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 3,
                    "pitch": "f",
                    "properties": []
                }
            ],
            "rhythm": [
                16,
                0
            ],
            "grace": true
        },
        {
            "kind": "tuplet",
            "notes": [
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 3,
                    "pitch": "d",
                    "properties": [
                        "^"
                    ]
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 4,
                    "pitch": "f",
                    "properties": [
                        "gra"
                    ]
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 6,
                    "pitch": "gn",
                    "properties": [
                        "sld"
                    ]
                }
            ],
            "rhythm": [
                8,
                0
            ],
            "grace": false
        },
        {
            "kind": "complex",
            "complexKind": "singleComplex",
            "string": 1,
            "rhythm": [
                8,
                0
            ],
            "pitch": "nopitch",
            "properties": []
        }
    ]
  },
  {
    "time": [
        3,
        4
    ],
    "key": "g",
    "capo": 2,
    "title": "Measure test",
    "composer": "Unknown",
    "tuning": "standard",
    "tuningNumbers": [
        0,
        7,
        2,
        9,
        5,
        0
    ]
  },
  {
    "time": false,
    "key": false,
    "capo": false
  },
  [4,0]
]

const complexMeasureResult = {
    "key": "g",
    "time": [
        3,
        4
    ],
    "capo": 2,
    "measureNumber": "1",
    "elements": [
        {
            "noteInfo": {
                "kind": "empty"
            },
            "duration": "norhythm",
            "start": 0,
            "width": 5,
            "lastNote": false,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        },
        {
            "noteInfo": {
                "kind": "singleNote",
                "note": {
                    "noteKind": "x",
                    "string": 5,
                    "eitherProperties": []
                },
                "multiProperties": [
                    "sls"
                ]
            },
            "duration": [
                4,
                0
            ],
            "start": 1,
            "width": 20,
            "lastNote": false,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        },
        {
            "noteInfo": {
                "kind": "groupNote",
                "notes": [
                    {
                        "noteKind": "normalGuitarNote",
                        "string": 6,
                        "pitch": "f#",
                        "fret": 0,
                        "eitherProperties": []
                    },
                    {
                        "noteKind": "normalGuitarNote",
                        "string": 3,
                        "pitch": "gn",
                        "fret": 3,
                        "eitherProperties": [
                            "har"
                        ]
                    },
                    {
                        "noteKind": "x",
                        "string": 1,
                        "eitherProperties": []
                    }
                ],
                "multiProperties": []
            },
            "duration": [
                8,
                1
            ],
            "start": 2,
            "width": 15.5,
            "lastNote": false,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        },
        {
            "noteInfo": {
                "kind": "tupletNote",
                "notes": [
                    {
                        "noteInfo": {
                            "kind": "singleNote",
                            "note": {
                                "noteKind": "normalGuitarNote",
                                "string": 1,
                                "pitch": "e",
                                "fret": 10,
                                "eitherProperties": []
                            },
                            "multiProperties": []
                        },
                        "duration": [
                            32,
                            0
                        ],
                        "start": 0,
                        "width": 6.692307692307692,
                        "lastNote": false,
                        "location": [
                            0,
                            0
                        ],
                        "graceNotes": [],
                        "comments": ""
                    },
                    {
                        "noteInfo": {
                            "kind": "singleNote",
                            "note": {
                                "noteKind": "normalGuitarNote",
                                "string": 2,
                                "pitch": "e",
                                "fret": 5,
                                "eitherProperties": []
                            },
                            "multiProperties": []
                        },
                        "duration": [
                            32,
                            0
                        ],
                        "start": 0,
                        "width": 12.092307692307692,
                        "lastNote": false,
                        "location": [
                            0,
                            0
                        ],
                        "graceNotes": [
                            {
                                "noteInfo": {
                                    "kind": "singleNote",
                                    "note": {
                                        "noteKind": "normalGuitarNote",
                                        "string": 4,
                                        "pitch": "gb",
                                        "fret": 9,
                                        "eitherProperties": [
                                            "ham"
                                        ]
                                    },
                                    "multiProperties": [
                                        "gra"
                                    ]
                                },
                                "duration": [
                                    64,
                                    0
                                ],
                                "start": 0,
                                "width": 5.4,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            },
                            {
                                "noteInfo": {
                                    "kind": "buffer"
                                },
                                "duration": "norhythm",
                                "start": 0,
                                "width": 0,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            }
                        ],
                        "comments": ""
                    },
                    {
                        "noteInfo": {
                            "kind": "singleNote",
                            "note": {
                                "noteKind": "normalGuitarNote",
                                "string": 3,
                                "pitch": "e",
                                "fret": 0,
                                "eitherProperties": []
                            },
                            "multiProperties": []
                        },
                        "duration": [
                            32,
                            0
                        ],
                        "start": 0,
                        "width": 6.692307692307692,
                        "lastNote": false,
                        "location": [
                            0,
                            0
                        ],
                        "graceNotes": [],
                        "comments": ""
                    }
                ]
            },
            "duration": [
                16,
                0
            ],
            "start": 2.75,
            "width": 25.47692307692308,
            "lastNote": false,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        },
        {
            "noteInfo": {
                "kind": "tupletNote",
                "notes": [
                    {
                        "noteInfo": {
                            "kind": "singleNote",
                            "note": {
                                "noteKind": "normalGuitarNote",
                                "string": 3,
                                "pitch": "d",
                                "fret": 22,
                                "eitherProperties": [
                                    "^"
                                ]
                            },
                            "multiProperties": []
                        },
                        "duration": [
                            16,
                            0
                        ],
                        "start": 0,
                        "width": 27.576923076923077,
                        "lastNote": false,
                        "location": [
                            0,
                            0
                        ],
                        "graceNotes": [
                            {
                                "noteInfo": {
                                    "kind": "singleNote",
                                    "note": {
                                        "noteKind": "normalGuitarNote",
                                        "string": 2,
                                        "pitch": "d#",
                                        "fret": 4,
                                        "eitherProperties": [
                                            "par"
                                        ]
                                    },
                                    "multiProperties": [
                                        "gra"
                                    ]
                                },
                                "duration": [
                                    8,
                                    0
                                ],
                                "start": 0,
                                "width": 6.5,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            },
                            {
                                "noteInfo": {
                                    "kind": "tupletNote",
                                    "notes": [
                                        {
                                            "noteInfo": {
                                                "kind": "singleNote",
                                                "note": {
                                                    "noteKind": "normalGuitarNote",
                                                    "string": 2,
                                                    "pitch": "f#",
                                                    "fret": 7,
                                                    "eitherProperties": []
                                                },
                                                "multiProperties": []
                                            },
                                            "duration": [
                                                8,
                                                0
                                            ],
                                            "start": 0,
                                            "width": 6.5,
                                            "lastNote": false,
                                            "location": [
                                                0,
                                                0
                                            ],
                                            "graceNotes": [],
                                            "comments": ""
                                        },
                                        {
                                            "noteInfo": {
                                                "kind": "singleNote",
                                                "note": {
                                                    "noteKind": "normalGuitarNote",
                                                    "string": 3,
                                                    "pitch": "f#",
                                                    "fret": 2,
                                                    "eitherProperties": []
                                                },
                                                "multiProperties": []
                                            },
                                            "duration": [
                                                8,
                                                0
                                            ],
                                            "start": 0,
                                            "width": 6.5,
                                            "lastNote": false,
                                            "location": [
                                                0,
                                                0
                                            ],
                                            "graceNotes": [],
                                            "comments": ""
                                        }
                                    ]
                                },
                                "duration": [
                                    16,
                                    0
                                ],
                                "start": 3,
                                "width": 13,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            },
                            {
                                "noteInfo": {
                                    "kind": "buffer"
                                },
                                "duration": "norhythm",
                                "start": 0,
                                "width": 0,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            }
                        ],
                        "comments": ""
                    },
                    {
                        "noteInfo": {
                            "kind": "singleNote",
                            "note": {
                                "noteKind": "normalGuitarNote",
                                "string": 6,
                                "pitch": "gn",
                                "fret": 1,
                                "eitherProperties": [
                                    "sld"
                                ]
                            },
                            "multiProperties": []
                        },
                        "duration": [
                            16,
                            0
                        ],
                        "start": 0,
                        "width": 13.876923076923077,
                        "lastNote": false,
                        "location": [
                            0,
                            0
                        ],
                        "graceNotes": [
                            {
                                "noteInfo": {
                                    "kind": "singleNote",
                                    "note": {
                                        "noteKind": "normalGuitarNote",
                                        "string": 4,
                                        "pitch": "f#",
                                        "fret": 9,
                                        "eitherProperties": []
                                    },
                                    "multiProperties": [
                                        "gra"
                                    ]
                                },
                                "duration": [
                                    16,
                                    0
                                ],
                                "start": 0,
                                "width": 5.8,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            },
                            {
                                "noteInfo": {
                                    "kind": "buffer"
                                },
                                "duration": "norhythm",
                                "start": 0,
                                "width": 0,
                                "lastNote": false,
                                "location": [
                                    0,
                                    0
                                ],
                                "graceNotes": [],
                                "comments": ""
                            }
                        ],
                        "comments": ""
                    }
                ]
            },
            "duration": [
                8,
                0
            ],
            "start": 3,
            "width": 41.45384615384616,
            "lastNote": false,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        },
        {
            "noteInfo": {
                "kind": "singleNote",
                "note": {
                    "noteKind": "x",
                    "string": 1,
                    "eitherProperties": []
                },
                "multiProperties": []
            },
            "duration": [
                8,
                0
            ],
            "start": 3.5,
            "width": 14,
            "lastNote": true,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        },
        {
            "noteInfo": {
                "kind": "barline"
            },
            "duration": "norhythm",
            "start": 0,
            "width": 0,
            "lastNote": false,
            "location": [
                0,
                0
            ],
            "graceNotes": [],
            "comments": ""
        }
    ],
    "width": 121.43076923076924,
    "changes": {
        "time": false,
        "key": false,
        "capo": false
    }
}

test('parseComplexMeasure', () => {
  expect(evalMeasure(...complexMeasure)).toEqual(complexMeasureResult)
})





//
