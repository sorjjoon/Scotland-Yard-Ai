# Performance testing

Performance testing was not really applicable for this project. Effors were made to try and make the program run faster, to maximize the amount of playouts in the allowed time frame. Some notes about performance are made in [testing](testing/testing.md).

More testing was done however on the quality of moves the ai makes, how the explorative version of MCTS compares to the pure version.

All tests were conducted with 3 detectives against X. The acual board game ruless calll for 4 detectives, but this was found to favor the detective side very heavily, so the number was dropped to 3, to allow for a more balanced game.

When pure MCTS ai played against itself, the results were fairly balanced, with a 5 s processing time detectives having around 60 % win rate (n=200). However the explorative version was found to completelly dominate the pure version.

With a sample size of around 200 games, detectives playing with the explorative version didn't lose a single game against X playing with the pure MCTS. (Process time 5 s, exploration param sqrt(2)).

After this, we determined the try and test the impact of the move processing time on the quality of moves the ai makes. Our hypothesis was that when initially, when an ai with a very high processing time would have a very high win rate against the ai with a smaller time window. Not completelly dominating however, since due to the random nature of MCTS, and the optimized nature of UCT, it is very possible for the algorithm to arrive at the same optimal move after 1 second and 1 hour of playouts. As the processing time is increased the win rates would aproach each other first rapidly, but after a while, the incerease of time would have a negligible impact.

Sets of 100 games were played (due to time constraints, number of games couldn't be larger, these simulations already took around 100 hours), with an exploration parameter of sqrt(2). The detective time was set to 3 seconds. X time started at 0.1 s.

| X time (s) | X win% |
| ---------- | :----: |
| 0.1        |  0.24  |
| 0.5        |  0.3   |
| 1          |  0.42  |
| 1.5        |  0.4   |
| 2          |  0.48  |
| 2.5        |  0.53  |
| 3          |  0.46  |
| 3.5        |  0.44  |
| 4          |  0.49  |

![winrate chart](testing/winrate.png "X winrates")

The results support our hypothesis, at around 2 seconds the X win precentage, any increase in processing time for X seems no impact on the quality of moves made by X (and the win% seems to even go down, but this is probably due to random variance).

Another target of intrest was the so called exploration parameter, used by UCT to determine how much emphasis is put on lightly visited children. We tried to find an optimal value for this parameter using an evolutionary algorithm. The goal was to intially set the the exploration parameter to a certain value, then generate "children" for this value, (by mutiplying with a random number between 0.8-1.2), then runing a set number of games for each exploration parameter (exploration param is only varied for one side, detectives or X, other is constant). After each candidate has been tested, we compare the results and form a new parameter as an average of the parameters that had the best results.

However in practice this didn't produce interesting results. We hypothesized that the exploration parameter would be neglible if the algorithm was allowed to run for long enough, so a process time of 1 second was used, but even then games will take around 5 minutes to finish, making testing slow. Further more, exploration parameter seemed to have minimal impact on performance. The parameter was varied for detectives, first starting from a value of 0.75, and another time of 1

We did two seperate test runs, one using a starting value of 0.75. After around 20 hours, the algorithm seemed to settle on a value of around 0.6 (it remained more or less constat for several consequtive runs). On another run we set the value to 1, and after some time the algorithm settled around 1.4 (close to sqrt(2), the value suggested by wikipedia). However testing these two against each other (one run detectives with 0.6, versus X with sqrt(2), another detectives with 1.4, versus X with sqrt(2)), returned very similar results to each other (48% vs 51%).

It was tested, that massive varations in the exploration parameter result in nonsensical results, a detective with a value of 10, had a win precentage of 9 % (n=20).

However small tweaks in the parameter seem to have minimal impact on results, and the sqrt(2) value, suggested by wikipedia seems to be at least very close to the absolute "best value" (if such a value exsists).

Small values for the parameter do however seem to greatly improve the performance, when playing with a short processing time. For example a detective with 1 second move time against X with 2 seconds, with a param of sqrt(2), only had around 20% win rate, however when the param was lowered to 0.1, win rate improved to 38 % (n=50).

Due to time constraints however, unfortunatelly we couldn't get enough results from this, to make proper conclusions (or graph the results).
