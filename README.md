# Marvel Character Search App
A small demo app using react.js with the Marvel REST API.

## Usage
Start typing the name of the character you are looking for until the top result matches it.

## Technical details
- Due to the incompleteness of the Marvel database, the characters without description will display a lorem ipsum text
- The search is exact for the first character and fuzzy for the rest. This means that you can get Iron Man by typing
  `ionman` but not if you type `ronman`
- For limiting the number of requests I cache all results after the first typed character and parform the fuzzy search
  locally
- Some of the characters are missing some urls so I replaced those with `.../#` links
