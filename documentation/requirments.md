# Requirments

The projects purpose is to play the game Scotland Yard against a computer. The chosen language for the project is Typescript.

## Algorithms

We will use the [Monte Carlo tree search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) to evaluate game positions.

The Algorithm was chosen, because it allows the evaluation of game positions without having to create a evaluation function for a particulat game state, which is difficult in the case of Scotland Yard.

Time complexity for the algorithm is not really applicable, since the algorithm is built around conducting playouts for a set amount of time. A single playout has a complexity of O(n), where n is the amount of moves before reaching an end state.

## Data structures

Few advanced data structures should be needed.

## Inputs and outputs

### Input

- The finished program will allow a human player to play any role against computer opponents, as well as examine the game they just played
- Games fully between computers will be possible as well

### Output/Gui

- The game will be fully visualized and games will be reviewable afterwards

The documentation and source code will be in english.
Matematiikan, fysiikan ja kemian opettajan kandiohjelma
