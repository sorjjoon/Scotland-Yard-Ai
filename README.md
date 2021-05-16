# Scotland-Yard-Ai

## Documentation

- [Requirments](/documentation/requirments.md)
- [Weekly reports](/documentation/reports)
- [Implementation](/documentation/implementation.md)
- [Testing](/documentation/testing)

## Usage

To build and run the project (all commands from the project root):

- Clone the repo, and navigate to the project root directory
- install [node](https://nodejs.org/en/download/) (cubbli has everything needed)
- install dependencies: 'npm install'
  - This will take a few minutes
- compile the source code: 'npm run compile'
  - compiled javascript should appear in the /dist folder, and there should a client.bundle.js file in the /public folder
- start the server: 'npm run start'
- open browser at [http://localhost:5000](/http://localhost:5000)
  - When selecting opponents for a game, there are currently 4 options
    - Human: Moves are made manually by the player
    - Random: The AI will choose a move at random
    - Pure: An implementation of PURE MCTS (a very simple MCTS)
    - Explorative: A more advanced version of MCTS, with a preference for exploring the gametree
      - Exploration parameter can be modified for both detectives and X seperately

Diffrent constants to customize the gameplay can be found in [/src/utils/constants.ts](/src/utils/constants.ts).

- After any modifications you will need to run compile and start again
- If you intend to modify the constants a lot, instead of 'npm run compile', use 'npm run watch' and 'npm run pack' for compiling, and 'npm run demon' to start the server
  - They will automatically recompile and restart the server as needed (after file save)
  - Depending on your browser, you may have to do a full page refresh as well, to refresh cached javascript (chrome/safari). Usually ctrl + refresh

Unit tests: npm test
\
Afterwards, coverage report will be in /coverage/lcov-report/index.html (and a summary in stdout)

Latest summary: [Coverage report](/documentation/testing/coverage.txt)
