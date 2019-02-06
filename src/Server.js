import { AsyncStorage } from 'react-native'

const load = () => {

  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem('@CoopCycle.servers')
        .then((data, e) => {
          if (e || !data) {

            return resolve([])
          }

          resolve(JSON.parse(data))
        })
    } catch (e) {
      resolve([])
    }
  })
}

const fetchRemote = () => {

  return new Promise((resolve, reject) => {
    try {
      fetch('https://coopcycle.org/coopcycle.json')
        .then(res => {
          if (res.ok) {
            res.json().then(resolve)
          } else {
            resolve([])
          }
        })
        .catch(e => resolve([]))
    } catch (e) {
      resolve([])
    }
  })
}

const save = data => {

  return new Promise((resolve, reject) => {
    try {
      AsyncStorage
        .setItem('@CoopCycle.servers', JSON.stringify(data))
        .then(e => resolve())
        .catch(e => resolve())
    } catch (e) {
      resolve()
    }
  })
}

class Server {

  static loadAll() {
    return new Promise((resolve, reject) => {

      // TODO Handle cache expiration
      Promise.all([ load(), fetchRemote() ])
        .then(values => {

          const [ localData, remoteData ] = values

          if (!remoteData) {

            return resolve(localData)
          }

          save(remoteData)
            .then(() => resolve(remoteData))

        })
    })
  }

}

export default Server
