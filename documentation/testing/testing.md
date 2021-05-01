# Testing

Testing has been done as unit tests, using [jest](https://jestjs.io/). Tests can be run by running 'npm run test' from the project root.

A coverage report is generated using Istanbul, which will be found in /coverage after a run. A summary will be stdout (the lastest summary can be found [here](coverage.txt))

All aspects of the program are tested, outside of client side scripts (in [/src/client/](/src/client)), which are used to implement the UI.

The bulk of the test data is example games, which are exported JSON from actual games.

Performance testing for the algorithm involved profiling the algorithm, to see if any potential performance improvments could be made. Unfortunatelly this seems impossible, as the vast majority of performance seems to be related to garbage collection, caused by having to copy to current game state to all children, when creating fresh children for the tree. [profile results](PURE_CPU_PROFILE.PNG). For example, we tried to increase the memory allocated for node.js runtime, but every increase from the default lowered performance substantially.

After having the Ai play against itself, it can be determined that an explorative MCTS, using sqrt(2) for exploration parameter (recommended by various scholary articles on the subject) plays significantly better than the pure MCTS. All tests were ran using 4 detectives against X, move processing time was 5 s. When PURE MCTS was playing against itself the game was heavily detecive favored, detectives managing to win around 60 % of games played (n=200). However when detectives using explorative MCTS played against an X using PURE MCTS ai, the results were 250-0 (detectives won every time). Explorative MCTS playing against itself had results similar to PURE MCTS against itself, around 70 % winrate for detectives. For future test, we've decided to drop the amount of detectives to 3, to hopefully make the game more balanced.
