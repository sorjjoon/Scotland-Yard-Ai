### Weekly report 3. (27.3-8.4)

The main focus for this week was all the writing extensive testing for all the already exsisting code, as well finishing the Game Tree implementation last week. Also several client side improvments, such as allowing debug information for MCST and allowing games to be replayed after finishing.

I wasted a lot of time refactoring code because I changed my mind about the architecture of the MCST trees after finishing the implementation. I know I want to implement multiple versions of MCST, so I designed GameTree to be easily extendable by the classes to implement a full version of MCST, but as most of the code the diffrent versions could use would identical, I wanted GameTree to implement all identical parts.

I had orignally thought I could use the GameTree class for client side scripts (most importanly game replay), so I wrote it completely isolated from any server side constants (most importantly gameMap and GraphNode lookup), and intended to provide this functionality via a second extended class, SearchTree, which would extend GameTree, but this approach quickly became a very complex mess of javascript inheritance and typescript typecasting, so I abandoned this idea to simply implement game replays in another way, and make GameTree the only base class for MCTS implementation.

Currently there is one working version of MCTS, a "Pure" monte carlo search tree, meaning games are completed at random. I will be implementing more versions next week, which take into account the results of previous runs when exploring the game tree.

As a note the ai is decent at playing, but definetly strugles a bit, especially detective coordination seems to be lacking at the moment, but this might be due to the nature random exploration.

Also if detectives are too far away from X, they will struggle to come up with good moves (as randomly stumbling into X is very unlikely). Hopefully this will be helped by new modes of transport (as Buses and metros were designed to help cover long distances)

Other than that, making unit tests has not been especially challenging, but writing and debuging tests has taken a huge amount of time. But currently the entire test, aside from client side scripts is fully tested (the few branches which remain untested are either lines which are never meant to be run, or do something too trivial to bother testing)

Jsdocs are a bit lacking still, but most of the public entrypoints are documented (and most of the ones that remain undocumented do something trivial, which can be guessed by the function name)

For next week: Implementing a new MCST shouldn't be very difficult, with the base GameTree class doing most of the work already. A larger refactoring will be to introduce uncertanty into the game, currently both sides, Detectives and X play with perfect information. While X should have perfect information, detectives should not, and they should have to guess at X:s location. A modification to GameTree children generation will fix this, but I'm not yet sure on the optimal way to introduce uncertanty to MCTS.

Also another huge refactoring will be to intorduce diffrent modes of transport to the game, the current map represents only TaxiWays, and this will complicate children generation even more. Though diffrent modes of transport have been taken into account when designing GraphNode and Player objects, so introducing this shouldn't be a huge undertaking (except for having to manually input all the edge data for bus/metro routes... and making sure the map looks clean afterwards... )

Time usage: ~ 65h
