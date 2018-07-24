# 3-D Crossword

Have you ever found yourself doing a crossword puzzle and thought to yourself, "wow, this could use a little more depth"? Fear not, the 3-D crosswords are here.

## Try it out
Just clone the repo and open `index.html`.

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
	"puzzle_data": [{
		"clue": String,
		"start": {
			"x": Integer,
			"y": Integer,
			"z": Integer
		},
		"direction": "A" | "D" | "I",
		"entry": String
	}]
}
```