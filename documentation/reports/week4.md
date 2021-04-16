### Weekly report 4. (8.4-16.4)

The focus this week was to fully implement the remaining game rules, different types of transport and x being hidden to the detectives most of the time. Started working on a more advanced version of MCTS, but couldn't get it to work for this deadline. (There is currently the choice for an explorative MCTS ai, but it does not make intelligent moves). Added some functionality to help with debugging, for example debuging string can be turned on by the user, and will offer some extra information (most usefully number of playouts). Also made a small improvemnt to detective ai if MisterX is too far away (exact distance configurable in constants) detective will simply rush X (take the move that puts them closer to X), instead of completing playouts.

The biggest challenge was implementing the missing game functionality, inputing the the needed edges for nodes had to done manually of course, which took a lot of time. While the core game functionality was designed to allow multiple edge types for nodes, and getting the game to work with diffrent types of routes was not a problem, the largest problems turned out to be updating unit testing.

Unit tests were built around example games exported in JSON, and any changes to the core objects (like adding a tickets object for Detective) made the used example games obsolete, which required rewriting huge parts of the tests.

Other than that, implementing an algorithm for finding out possible X locations, knowing where he was a few turns ago was a small challenge.

Now that all the game rules are 100 % implemented, I started to fully work on more advanced versions of MCTS. The first improvment I wanted to make was a version which would choose during the selection process always the child node which has historically had the most success (sort of mimicking minimax), however I quickly ran into problems (the AIs quality degraded substantially), which I couldn't figure out for this weeks return, but will fully dive into next week.

For next week I will finally dive deeper into implementing more advanced versions of MCTS, the currently rudementary version doesn't use the results of previous runs in anyway to try and predict what the best child nodes to explore are, which is instrumental to implementing an effective version of MCTS. I unfortunatelly couldn't get even a simple version of this to work for todays deadline, but hopefully by next week I could start experimenting with ways to improve MCTS to fit Scotland Yard specifically
