import { CHAT_LENGTH } from '../utils/Constants'
import { Server } from 'ws'
import Errors from '../errors'
import Regex from '../utils/Regex'
import Dispatcher from './Dispatcher'
import Response from './Response'
import Request from './Request'
import Player from './Player'
import Euler from './Euler'

const SERVER_POST = 8093

export default class GameServer extends Server {
  #players = []
  #gameClock = 0
  
  static #instance = null

  constructor () {
    super({
      port: SERVER_POST /* ,
      perMessageDeflate: {
          zlibDeflateOptions: {
              chunkSize: 1024,
              memLevel: 7,
              level: 3
          },
          zlibInflateOptions: {
              chunkSize: 10 * 1024
          },
          clientNoContextTakeover: true,
          serverNoContextTakeover: true,
          serverMaxWindowBits: 10,
          concurrencyLimit: 10,
          threshold: 1024
      } */
    })
    this.#players = []
    if (GameServer.#instance != null) {
      this.close()
      return GameServer.#instance
    }
    this.on('connection', (ws, rq) => this.onJoin(ws, rq))
    this.on('close', (ws, rq) => this.onQuit(ws, rq))
    GameServer.#instance = this
    console.log(`Server starts: ws://localhost:${SERVER_POST}`)
  }

  async onJoin (webSocket, request) {
    try {
      if (!request.headers.origin || !Regex.ALLOWED_ORIGIN.test(request.headers.origin)) {
        webSocket.close()
        throw new Errors.OriginError()
      }
      console.log('> new connection')
      webSocket.on('message', (msg) => this.onMessage(webSocket, msg))
      webSocket.on('close', (event) => this.onQuit(webSocket, event))
      webSocket.sendObject = function (object) {
        this.send(object.toJSON ? object.toJSON() : JSON.stringify(object))
      }
      webSocket.sendDispatch = function (action, payload) {
        this.sendObject(new Response('dispatch', new Dispatcher(action, payload)))
      }
      const player = new Player(webSocket)
      this.#players.push(player)
      webSocket.sendObject(new Response('player', JSON.parse(player.toJSON(true))))
    } catch (error) {
      console.error(error)
    }
  }

  async onMessage (webSocket, message) {
    // console.log('receive: ', message)
    try {
      const request = JSON.parse(message)
      if (!Request.check(request)) {
        throw new Errors.RequestError()
      }
      const player = this.#players.find(p => p.webSocket == webSocket)
      // todo : bypass with token: "      "?
      if ((!player) || (player.id !== request.player) ||
        (request.token && !Regex.IS_EMPTY.test(request.token) && player.privateToken !== request.token)) {
        throw new Errors.CredentialsError()
      }
      switch (request.action) {
        case 'ping':
          if (request.data.timestamp) {
            webSocket.sendObject(new Response('pong', { timestamp : request.data.timestamp }))
          }
          break;
        case 'join':
          if (Regex.IS_USERNAME.test(request.data.username)) {
            if (this.#players.some(p => p.username == request.data.username)) {
              throw new Errors.UsedUsernameError()
            }
            player.name = request.data.username
            for (const _p of this.#players) {
              if (_p.id !== player.id) {
                _p.webSocket.sendObject(new Response('dispatch', new Dispatcher('addPlayer', _p)))
              } else {
                _p.webSocket.sendDispatch('setState', 'loading')
              }
            }
          } else {
            throw new Errors.BadUsernameError()
          }
          break
        case 'chat':
          if (!player.name || Regex.IS_EMPTY.test(player.name)) {
            throw new Errors.SendMsgError()
          }
          if (request.data.message) {
            const message = ('' + request.data.message).substr(0, CHAT_LENGTH)
            for (const _player of this.#players) {
              const payload = {
                player: JSON.parse(player.toJSON()),
                message,
                hash: (player.id + (+new Date) + message).split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
              }
              _player.webSocket.sendObject(new Response('dispatch', new Dispatcher('addChatMessage', payload)))
            }
          }
          break
        case 'rotation':
          if (request.data.angle && Euler.check(request.data.angle)) {
            for (const _player of this.#players) {
              if (_player.id !== player.id) {
                _player.webSocket.sendObject(
                  new Response(
                    'rotation',
                    {
                      player: player.id,
                      rotation: request.data.angle
                    }
                  )
                )
              } else {
                _player.rotation = request.data.angle
              }
            }
            break
          }
        default:
          throw new Errors.RequestError()
      }
    } catch (error) {
      webSocket.sendObject(new Response('error', error.message))
      webSocket.close()
      console.error(error.message)
    }
  }

  async onQuit (webSocket, request) {
    console.log('> leave')
    this.#players = this.#players.filter(p => p.webSocket !== webSocket)
  }
}
