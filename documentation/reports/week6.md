### Weekly report 6. (24.4-1.5)

The focus for this week was fine tuning the AI testing. After realizing that the explorative version of MCTS, using an exploration parameter (which determines, how much lightly visited nodes are explored) of sqrt(2), recommended by some scholarly articles on the subject, was significantly better than the PURE MCTS counterpart, the next focus was trying to find an optimal value for the exploration parameter.

The algorithm for this is as follows: First generate x new candidates for the exploration parameter (multiplying a random float between 0.85-1.15 from the current param), play y rounds with each parameter (x and y can be adjusted by the user), rounds are finished, a new parameter is calculated as an average of the parameters with the best scores. Theoretically, if this algorithm is allowed to run for a long enough time, we should find an optimal value for the exploration parameter.

I tried to test the algorithm overnight, but unfortunatelly seems my computer crashed during the night, there seems to be memory leak somewhere in the program, which causes the browser to crash if left to run for a too long time. I will try to fix the issue, and gather some data on the impact of the exploration parameter for the final deadline.

Another parameter, move processing time (how long the program runs simulations before choosing the best move) has been allowed to be tweaked for detectives and X seperately.
