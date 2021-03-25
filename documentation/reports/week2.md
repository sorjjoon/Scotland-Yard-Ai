### Weekly report 3. (21.3-27.3)

Created a base for the project, mainly the server implmentation. Created the game map with an external program (Gephi), exported it to json and used the library sigmajs to embed it into the webpage. For simplicity, only taxi routes are implemented in the current game map, other types of routes will come later (after implementing MCST). The lack of diffrent kind of routes will not matter when implementing the ai, only diffrence will be in how child states for the current game state are generated (which can easily be modified later)

Created a working base game, which allows playing against humans as well a dummy ai (currently always pick the neighbouring node with the smallest id). 

A lot of gui tweaks, created a sidebar for the game history, blinking color for the node currently used. 

Hid Mister X color during detectives turn (unless his location has been revealed)

Did a lot of refactoring, preparing to eventually migrate client side scripts (currently in js) to typescript. Integrated webpack (in the currently pushed version does nothing, but is used in the development version for packing client scripts).

Added unit testing (currenly tests for the GameMap and GraphNode objects)

Biggest refactoring was moving all methods that need the current game map (implemented as a process wide constant, which is instated at start up) to seperate file, to be loaded as prototypes. This allows the same classes (mainly Player and Gamenode) to be used in server side scripts as well (since they can not depend on the game map). Main benefits will be to make the gui code more readable and easier to document.

For example all constants to modify the gameplay, located in utils/constants can be used by client side scripts as well (and don't have to passed as parameters when rendering index). Eventually should remove the need for server side rendering completelly, the game will run completelly in the browser, the server is only used to calculate optimal moves for the ai.

Currently all assets outside folders MCST and server can be used in both server side, as well as client side (in the browser).

Finally, as preperation for next week, began implementing the GameTree class (not pushed atm)

Time usage: ~ 20h

Currently the base game is working fine, (and the gui looks good enough).

I had to do a lot of research to the various tools used to make a functioning node project, such as using multiple tsconfigs or webpack, as well as numerous other typescirpt oddities, such as how to deal with prototypes (declare global/module). Implementing unit tests was much easier than I expected, jest came builtin with all the tools I needed (including code coverage and support for typescript), so it needed next to no configuration.

At the moment everything seems clear, but I am worried I am spending a little too much worrying about how readable the client side code will be (meaning the gui code), as it was the major motivation for doing the huge refactoring to allow domain objects to independent of game map, as well as having to resort to prototypes to implement all the needed functionality for Player and GraphNode. 

The goal for next week will be the implementation of the MCST algorithm (and maybe the migaration to full typescript?)



