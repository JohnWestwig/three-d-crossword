# 3-D Crossword

Have you ever found yourself doing a crossword puzzle and thought to yourself, "wow, this could use a little more depth"? Fear not, the 3-D crosswords are here.

## Data format
```
{
	"puzzle_id": Integer,
	"version": Integer,
	"puzzle_meta": {
		"title": String,
		"editor": String,
		"height": Integer,
		"width": Integer,
		"depth": Integer,
		"author": String
	},
	"puzzle_data": {
		"A": [Entry],
		"D": [Entry],
		"I": [Entry]
	}
}
```

## Entry format
```
{
	"clue": String,
	"start": {
		"x": Integer,
		"y": Integer,
		"z": Integer
	},
	"entry": String
}
```