import { GameState } from "../GameState";
import { GameTree } from "../GameTree";

/**
 * A more explorative version of MCTS, using UCT (Upper Confidence Bound 1 applied to trees) for choosing optimal child nodes.
 *
 * Will focus more on expoloring unvisited nodes during selection
 */
export class ExplorativeSearchTree extends GameTree {
  exploitationParameter: number;
  /**
   * @param  {GameState} initialState
   * @param  {number} exploitationParameter defaults to sqrt(2)
   */
  constructor(initialState, c = Math.SQRT2) {
    super(initialState);
    this.exploitationParameter = c ?? Math.SQRT2;
  }

  /**
   * Find all possible game states from this position in one move
   * @returns { PureSearchTree[]} children
   */
  public getChildren(): readonly ExplorativeSearchTree[] {
    //Doesn't change functionality, just here for type conversion
    return super.getChildren() as ExplorativeSearchTree[];
  }

  protected selection() {
    var XWins;
    if (this.isLeaf()) {
      if (this.getWinner() !== null) {
        XWins = this.rollout();
      } else {
        //Pick an unvisited child AT RANDOM
        XWins = this.getChildren()
          .filter((x) => x.visits == 0)
          .getRandom()
          .rollout();
      }
    } else {
      let comparator = (a, b) => {
        return a.UCT(this.visits) - b.UCT(this.visits);
      };
      if (this.state.playerToMove.role !== this.getChildren()[0].state.playerToMove.role) {
        comparator = (a, b) => {
          return b.UCT(this.visits) - a.UCT(this.visits);
        };
      }
      let bestChilds = this.getChildren().getAllMax(comparator);
      XWins = bestChilds.getRandom().selection();
    }
    return this.propogate(XWins);
  }
  /**
   * Returns the numerical value for Upper Confidence Bound 1 applied to trees) for this node.
   *
   * Remember to flip this for cases, where the
   * @param  {number} parentVisits
   * @returns {number}
   */
  private UCT(parentVisits: number): number {
    return this.wins / this.visits + this.exploitationParameter * (Math.log(parentVisits) / this.visits);
  }
}
