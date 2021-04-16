# Implementation

## Monte Carlo Search Tree

The Ai for the game is implemented using [Monte Carlo tree search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) (MCTS). MCTS in a nutshell is based around generating a gametree (not the entire tree in memory of course), then exploring this tree to try and find good moves. At first the exploration is purely random, but over time, with more and more data on the gametree, we cna start to focus our search on branches of the tree which seem promising.

Our gametree is represented as tree structure, with the root node being our current gamestate, which we want to evaluate and child nodes representing moves the current player can make.

## Program Overview

The programm can be devised into two distinct parts, the backend server, and the frontend ui.

For the UI we use a simple, one page website, which keeps track and visualizes the current game state, and allows the user to play against the computer (or themselves). The current gamestate (who's turn it is, what the turn counter, how many tickets for detectives etc.) is fully tracked by the client browser. After a game is finished, the client can also replay the previous game move by move.

The server is used only for calculating optimal moves (as well as serving all the required html, js and css).

There are numerous [constants](/src/utils/constants.ts) that can be used to modify the gameplay. Unfortunatelly, it is not currently possible to modify these directly from the client browser, but the source code needs to be modified directly (and the project recompiled, and the server restarted.)
