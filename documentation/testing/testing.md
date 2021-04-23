# Testing

Testing has been done as unit tests, using [jest](https://jestjs.io/). Tests can be run by running 'npm run test' from the project root.

A coverage report is generated using Istanbul, which will be found in /coverage after a run. A summary will be stdout (the lastest summary can be found [here](coverage.txt))

All aspects of the program are tested, outside of client side scripts (in [/src/client/](/src/client)), which are used to implement the UI.

The bulk of the test data is example games, which are exported JSON from actual games.

Performance testing for the algorithm involved profiling the algorithm, to see if any potential performance improvments could be made. Unfortunatelly this seems impossible, as the vast majority of performance seems to be related to garbage collection, caused by having to copy to current game state to all children, when creating fresh children for the tree. [profile results](PURE_CPU_PROFILE.PNG). For example, we tried to increase the memory allocated for node.js runtime, but every increase from the default lowered performance substantially.

The effectivness of the AI is tested by having the AI play against versions of itself (PURE vs EXPLORATIVE) tests are being conducted, but are taking a long time (since we are still using 5s per move for calculations)
