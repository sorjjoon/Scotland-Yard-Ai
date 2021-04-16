import { GraphNode } from "../../domain/GraphNode";
import { GameState } from "../GameState";
import { GameTree } from "../GameTree";
/**
 * Simplest MCST search tree, during selection nodes are picked at random, regardless of previous visits/wins
 */
export class PureSearchTree extends GameTree {
  /**
   * Find the optimal move based on the results of currently completed playouts
   * @returns {GraphNode}
   */
  public getBestMove(): GameTree {
    let bestTree = this.children.getMax(
      this.getFlippedComparator((a, b) => {
        return a.wins / a.visits - b.wins / b.visits;
      })
    );
    return bestTree;
  }
  /**
   * Find all possible game states from this position in one move
   * @returns { PureSearchTree[]} children
   */
  public getChildren(): readonly PureSearchTree[] {
    //Doesn't change functionality, just here for type conversion
    return super.getChildren() as PureSearchTree[];
  }

  protected selection() {
    var XWins;
    if (this.isLeaf()) {
      if (this.getWinner() !== null) {
        XWins = this.rollout();
      } else {
        //Pick an unvisited child node AT RANDOM
        XWins = this.getChildren()
          .filter((x) => x.visits == 0)
          .getRandom()
          .rollout();
      }
    } else {
      XWins = this.getChildren().getRandom().selection();
    }
    return this.propogate(XWins);
  }
}
