# Implementation

## Monte Carlo Tree Search

The Ai for the game is implemented using [Monte Carlo tree search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) (MCTS). MCTS in a nutshell is based around generating a gametree (not the entire tree in memory of course), then exploring this tree to try and find good moves. At first the exploration is purely random, but over time, with more and more data on the gametree, we can start to focus our search on branches of the tree which seem promising.

MCTS is based around completing randomized games, called playouts, for a preset duration. After the predetermined time has past, results from the completed simulations are compared, and the optimal move is chosen. A single playout is composed of the following 3 steps (the same naming is used in the source code), starting from the root state:

1. **Selection**  
   If this state has unvisited child states (or is an end state), pick a child (at random) and go to step 2. These stated are called 'leaves'  
   Otherwise, pick a child, using the results from previous playouts to influence our decision, and repeat this step recursively.
2. **Rollout**  
   If this state is an endstate (meaning one side has won), go to step 3  
   Otherwise, pick a child state, at random and repeat this step recursively
3. **Propagate**  
   Determine the winner for this state, and update the visits / wins for this state accordingly.
   Note, when updating victories, they must be according to whoever is the player to move at the current state.
   The result of the playout is propagated up the recursion, all the way up to the root (and each visited state updates their visited / wins values in the same fashion)

Steps 2 and 3 are similar between all implementations of MCTS, but step 1, selection, largely determines how well the ai acually plays. There are numerous ways this step can be implemented, depending on how we want the ai to play, or the type of game we are developing an ai for.

In this project we have implented two versions of this, so called pure MCTS, and a more explorative MCTS (not an official term).

Pure MCTS has a simple selection process, child states are always picked at random (in essence skips straight to step 2, but ensures every child state is visited at least once). After completing playouts, the best move (for the root) is determined by which child state has the best win precentage.

Our more advanced version fo MCTS (which we call explorative MCTS) calculates an upper confidence bound (called UCT in source code, upper confidence bound for trees) for child states and picks the child with the highest value. The exact formula used can be found in [wikipedia](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search#Exploration_and_exploitation). The formula has one parameter, called exploration parameter, which influences how much emphasis is put into exploring lightly visited states, versus visiting states we know to produce good results (i.e. has a good win precentage). After the set amount of time has passed, the best move is determined by checkign which child node was VISITED the most, ignoring win precentage. High visitations already means the state usually has the best win precentage among children, the only time these would differ would be a lightly visited state suddenly has it's win precentage rise, but the algorithm is interrupted before the state can be visited more. In this case it is usually safer to go with the well explored good child, rather than risk trying the lightly explored, but promising child. It could very well be, that if the algorithm was given more time, it would realize that the newly found child is acually the best one, or a string of lucky victories infalted the childs win rate, and upon further exploration the state was not promising at all.

The default value for the exploration param is sqrt(2), as suggested by wikipedia.

Our game state is represented as tree structure, with the root node being our current gamestate and child states representing moves the current player can make.

## Game Rules

The project implements most of the Scotland Yard boardgame rules. The game is centered around a group of detectives trying to catch Mister X. Both players can move around the map using taxi, bus or metroroutes (yellow, green, red). X has an infinite amount of tickets, but detectives each have a limited number of tickets they can use. The game ends if X is caught (a detective ends/starts their turn in the same node as X). Mister X is usually hidden from the detectives, but he is periodically revealed to the detectives (around every 4 turns). When revealed, detectives know the exact location of X, but after his next move he will be again hidden. Detectives do know however what forms of transport X uses to move around the city (and can use this to try and narrow down his location).

## Program Overview

The programm can be devised into two distinct parts, the backend server, and the frontend ui.

For the UI we use a simple, one page website, which keeps track and visualizes the current game state, and allows the user to play against the computer (or themselves). The current gamestate (who's turn it is, what the turn counter, how many tickets for detectives etc.) is fully tracked by the client browser. After a game is finished, the client can also replay the previous game move by move.

The server is used only for calculating optimal moves (as well as serving all the required html, js and css).

There are numerous [constants](/src/utils/constants.ts) that can be used to modify the gameplay. Unfortunatelly, it is not currently possible to modify these directly from the client browser, but the source code needs to be modified directly (and the project recompiled, and the server restarted.)

However constants which impact how the AI plays, the amount of processing time per move, and the exploration factor for explorative MCTS can be customized from the UI. The impact of varying these factors on the AI performance was analyzed more closely, a synopsis of the results can be found here [performance](performance.md)

## Testing Overview

The programm has the functionality for easily looping the gameplay, to test impact of various parameters on the effectivness of the AI.
