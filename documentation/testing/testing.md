# Testing

Testing has been done as unit tests, using [jest](https://jestjs.io/). Tests can be run by running 'npm run test' from the project root.

A coverage report is generated using Istanbul, which will be found in /coverage after a run. A summary will be stdout (the lastest summary can be found [here](coverage.txt))

All aspects of the program are tested, outside of client side scripts (in [/src/client/](/src/client)), which are used to implement the UI.

The bulk of the test data is example games, which are exported JSON from actual games.
