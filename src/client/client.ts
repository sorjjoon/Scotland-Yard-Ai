import * as _ from "../domain/player"
import { Color } from "../utils/constant"

export function Hello() {
    return new _.Detective(null, 2, Color.blue, 10)
}