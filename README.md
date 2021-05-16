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
    - **Human**: Moves are made manually by the player
    - **Random**: The AI will choose a move at random
    - **Pure**: An implementation of PURE MCTS (a very simple MCTS)
    - **Explorative**: A more advanced version of MCTS, with a preference for exploring the gametree
      - Exploration parameter can be modified for both detectives and X seperately
  - Move process time controls how long playouts are run, before choosing the best move
  - Detectives can always see X
    - Makes it so X is always revealed to the detectives
  - Additional options are for running automated games, and have no impact unless **Loop gameplay** is also checked. All results from automated tests are printed to console (check devtools for your browser)
    - **Rounds between updates**
      - How many rounds are done before any updates are made (to process time, or exploration param)   
    - **Vary Exploration parameter**
      - Exploration parameter is varied between rounds, using an evolutionary algorithm (varies for X or detectives, other remains constant)
      - Number of Exploration pram candidates
        - How many random new exploration candidates are created (after all had games played, equal to **Rounds between updates**, a new exploration param is created as an avergae of the best candidates from the previous round).
    - **Vary time between loops**
      - Vary time for detectives or X, after **Rounds between updates** has passed
    - **Increment time**
      - After **Rounds between updates**, how much move process time is incremented. No impact if "No variation" is selected for vary time    

Diffrent constants to customize the gameplay can be found in [/src/utils/constants.ts](/src/utils/constants.ts). Most have minimal impact (and therefor not implemented in the gui), with the expection of the number of detectives used.

- After any modifications you will need to run compile and start again
- If you intend to modify the constants a lot, instead of 'npm run compile', use 'npm run watch' and 'npm run pack' for compiling, and 'npm run demon' to start the server
  - They will automatically recompile and restart the server as needed (after file save)
  - Depending on your browser, you may have to do a full page refresh as well, to refresh cached javascript (chrome/safari). Usually ctrl + refresh

Unit tests: npm test
\
Afterwards, coverage report will be in /coverage/lcov-report/index.html (and a summary in stdout)

Latest summary: [Coverage report](/documentation/testing/coverage.txt)
