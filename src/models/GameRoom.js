export default class GameRoom {
  #players = []
  #state = 0
  #timer = 0
  
  constructor () {
    Object.defineProperties(this, 'PENDING', {
      value: 0,
      writable: false
    })
    Object.defineProperties(this, 'RUNNING', {
      value: 1,
      writable: false
    })
    Object.defineProperties(this, 'ENDED', {
      value: 2,
      writable: false
    })
  }

  addPlayer (player) {
    this.#players.push(player)
  }

  removePlayer (player) {
    this.#players = this.#players.filter(p => p != player && p.id !== player)
  }
}
