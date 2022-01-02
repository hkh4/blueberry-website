// TESTING THE PARSER
const { grammar } = require("./../score/parser")

// A really simple document example
const simpleGrammar =
`-title Test
-composer Hugo
-time 4-4
-capo 0
-key c

1:
  1e
  1e
  1e
  1e
`

const simpleGrammarResult = [
    [
        {
            "kind": "scoreOption",
            "option": "title",
            "value": "Test"
        },
        {
            "kind": "scoreOption",
            "option": "composer",
            "value": "Hugo"
        },
        {
            "kind": "scoreOption",
            "option": "time",
            "value": "4-4"
        },
        {
            "kind": "scoreOption",
            "option": "capo",
            "value": "0"
        },
        {
            "kind": "scoreOption",
            "option": "key",
            "value": "c"
        }
    ],
    [
        {
            "kind": "parserMeasure",
            "measureNumber": "1",
            "notes": [
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 1,
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 1,
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 1,
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 1,
                    "pitch": "e",
                    "properties": []
                }
            ]
        }
    ]
]

test('simple grammar', () => {
  expect(grammar.tryParse(simpleGrammar)).toEqual(simpleGrammarResult)
})



// A much more complicated document
const comp =
`-title Test
-capo 2
-key f
-time 3-8
-composer Hugo
-tuning e-a-d-g-b-e

%test%
1:
	6x8../gra/slu
	1e
	%test%
	r4
	$hi$
	(3dn 4fb 6x/par)
	<1f#8/har 2dn4/par/sli/sls (4f#/sld 1x/har)16./gra/sle>32./gra

-key g

%hi%
4:
	2f4.
	$lol$
-time 5-4
-capo 4

5:
  2e16
  <2f#16 3g16 4g16/har>8
  2a16
  6bb2
  1f8/gra
  2a4
`

const compResult = [
    [
        {
            "kind": "scoreOption",
            "option": "title",
            "value": "Test"
        },
        {
            "kind": "scoreOption",
            "option": "capo",
            "value": "2"
        },
        {
            "kind": "scoreOption",
            "option": "key",
            "value": "f"
        },
        {
            "kind": "scoreOption",
            "option": "time",
            "value": "3-8"
        },
        {
            "kind": "scoreOption",
            "option": "composer",
            "value": "Hugo"
        },
        {
            "kind": "scoreOption",
            "option": "tuning",
            "value": "e-a-d-g-b-e"
        }
    ],
    [
        {
            "kind": "parserMeasure",
            "measureNumber": "1",
            "notes": [
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 6,
                    "rhythm": [
                        8,
                        2
                    ],
                    "pitch": "nopitch",
                    "properties": [
                        "gra",
                        "slu"
                    ]
                },
                {
                    "kind": "simple",
                    "simpleKind": "singleSimple",
                    "string": 1,
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "complex",
                    "complexKind": "restComplex",
                    "rhythm": [
                        4,
                        0
                    ]
                },
                {
                    "kind": "comment",
                    "comment": "hi"
                },
                {
                    "kind": "group",
                    "groupKind": "groupSimple",
                    "notes": [
                        {
                            "string": 3,
                            "pitch": "dn",
                            "eitherProperties": []
                        },
                        {
                            "string": 4,
                            "pitch": "fb",
                            "eitherProperties": []
                        },
                        {
                            "string": 6,
                            "pitch": "nopitch",
                            "eitherProperties": [
                                "par"
                            ]
                        }
                    ],
                    "multiProperties": []
                },
                {
                    "kind": "tuplet",
                    "grace": true,
                    "notes": [
                        {
                            "kind": "complex",
                            "complexKind": "singleComplex",
                            "string": 1,
                            "rhythm": [
                                8,
                                0
                            ],
                            "pitch": "f#",
                            "properties": [
                                "har"
                            ]
                        },
                        {
                            "kind": "complex",
                            "complexKind": "singleComplex",
                            "string": 2,
                            "rhythm": [
                                4,
                                0
                            ],
                            "pitch": "dn",
                            "properties": [
                                "par",
                                "sli",
                                "sls"
                            ]
                        },
                        {
                            "kind": "group",
                            "groupKind": "groupComplex",
                            "rhythm": [
                                16,
                                1
                            ],
                            "notes": [
                                {
                                    "string": 4,
                                    "pitch": "f#",
                                    "eitherProperties": [
                                        "sld"
                                    ]
                                },
                                {
                                    "string": 1,
                                    "pitch": "nopitch",
                                    "eitherProperties": [
                                        "har"
                                    ]
                                }
                            ],
                            "multiProperties": [
                                "gra",
                                "sle"
                            ]
                        }
                    ],
                    "rhythm": [
                        32,
                        1
                    ]
                }
            ]
        },
        {
            "kind": "scoreOption",
            "option": "key",
            "value": "g"
        },
        {
            "kind": "parserMeasure",
            "measureNumber": "4",
            "notes": [
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 2,
                    "rhythm": [
                        4,
                        1
                    ],
                    "pitch": "f",
                    "properties": []
                },
                {
                    "kind": "comment",
                    "comment": "lol"
                }
            ]
        },
        {
            "kind": "scoreOption",
            "option": "time",
            "value": "5-4"
        },
        {
            "kind": "scoreOption",
            "option": "capo",
            "value": "4"
        },
        {
            "kind": "parserMeasure",
            "measureNumber": "5",
            "notes": [
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 2,
                    "rhythm": [
                        16,
                        0
                    ],
                    "pitch": "e",
                    "properties": []
                },
                {
                    "kind": "tuplet",
                    "notes": [
                        {
                            "kind": "complex",
                            "complexKind": "singleComplex",
                            "string": 2,
                            "rhythm": [
                                16,
                                0
                            ],
                            "pitch": "f#",
                            "properties": []
                        },
                        {
                            "kind": "complex",
                            "complexKind": "singleComplex",
                            "string": 3,
                            "rhythm": [
                                16,
                                0
                            ],
                            "pitch": "g",
                            "properties": []
                        },
                        {
                            "kind": "complex",
                            "complexKind": "singleComplex",
                            "string": 4,
                            "rhythm": [
                                16,
                                0
                            ],
                            "pitch": "g",
                            "properties": [
                                "har"
                            ]
                        }
                    ],
                    "grace": false,
                    "rhythm": [
                        8,
                        0
                    ]
                },
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 2,
                    "rhythm": [
                        16,
                        0
                    ],
                    "pitch": "a",
                    "properties": []
                },
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 6,
                    "rhythm": [
                        2,
                        0
                    ],
                    "pitch": "bb",
                    "properties": []
                },
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 1,
                    "rhythm": [
                        8,
                        0
                    ],
                    "pitch": "f",
                    "properties": [
                        "gra"
                    ]
                },
                {
                    "kind": "complex",
                    "complexKind": "singleComplex",
                    "string": 2,
                    "rhythm": [
                        4,
                        0
                    ],
                    "pitch": "a",
                    "properties": []
                }
            ]
        }
    ]
]

test('complex grammar', () => {
  expect(grammar.tryParse(comp)).toEqual(compResult)
})




















//
