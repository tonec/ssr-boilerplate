import { webSocket } from 'rxjs/webSocket'
import axiosInstance from './helpers/apiClient'
import config from './config'

const url = `ws://${config.apiHost}/ws`

export default serverRequest => {
  const axios = axiosInstance(serverRequest)

  let ws = null

  if (!__SERVER__) {
    ws = webSocket(url)

    ws.subscribe(
      message => console.log('Message: ', message),
      err => console.error('Error: ', err),
      () => console.warn('Completed!')
    )

    ws.next({
      action: 'fetch_self',
      entity: 'User',
      meta: {
        auth_token: '99bf14dbe03adf998cf0d597de880581'
      }
    })
  }

  const send = apiRequest => {
    console.log('apiRequest', apiRequest)
    if (__SERVER__) {
      // If this is running on the server perform an http request
      return axios.post('', apiRequest).then(response => console.log(response.data))
    }

    ws.next(apiRequest)

    return Promise.resolve()
  }

  return { send }
}
