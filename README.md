# Scotland-Yard-Ai

- [Requirments](/documentation/requirments.md)
- [Weekly reports](/documentation/reports)
- [Coverage report](/documentation/testing/coverage.txt)

# Usage

To build and run the project:

- Clone the repo, and navigate to the project root directory
- install [node](https://nodejs.org/en/download/) (cubbli has everything needed)
- install dependencies: npm install
- compile the source code: npm run compile
  - compiled javascript should appear in the /dist folder, and there should client.bundle.js file in the /public folder
- start the server: npm run start
- open browser at [http://localhost:5000](/http://localhost:5000)

Unit tests: npm test
\
Afterwards, coverage report will be in /coverage/lcov-report/index.html (and a summary in stdout)

Latest summary: [Coverage report](/documentation/testing/coverage.txt)
