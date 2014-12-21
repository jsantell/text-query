# text-query

[![Build Status](http://img.shields.io/travis/jsantell/text-query.svg?style=flat-square)](https://travis-ci.org/jsantell/text-query)
[![Build Status](http://img.shields.io/npm/v/text-query.svg?style=flat-square)](https://www.npmjs.org/package/text-query)

Simple query tokenizer for turning a query string into a comparator for other text fields.

## Usage

```js
var Query = require("text-query");

// Create a query: spaces are OR'd groups and commas AND groups, with
// double quoted strings being one search entity.
var q = new Query("'death metal', swedish finnish, guitar bass drums");

// This query only returns true of "death metal" is in the text,
// along with "swedish" OR "finnish", and an instrument ("guitar" or "bass" or "drums")
// must also be in the string.
q.matches("swedish death metal for guitarists"); // true
q.matches("death metal for finnish bassists"); // true
q.matches("death to swedish metal drums"); // false, 'death metal' is not a single string
q.matches("norwegian death metal for guitarists"); // false, missing 'swedish' or 'finnish'

```

## Installation

`$ npm install text-query`

## API

### new Query(query)

Creates a new Query object with `query` string.

### query.matches(text)

Returns a boolean indicating whether or not `text` matches the internal `query`.

## Testing

`npm test`

## License

MIT License, Copyright (c) 2014 Jordan Santell
