export default class Euler {
    x = 0
    y = 0
    z = 0

    constructor (x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
        
        if (!Euler.check(this)) {
            throw new TypeError()
        }
    }

    static check(euler) {
        return typeof euler.x !== 'undefined' &&
            typeof euler.x !== 'undefined' &&
            typeof euler.x !== 'undefined' &&
            !(isNaN(euler.x) || isNaN(euler.y) || isNaN(euler.z))
    }
}
