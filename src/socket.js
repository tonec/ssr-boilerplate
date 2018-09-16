import { webSocket } from 'rxjs/webSocket'
import axiosInstance from './helpers/apiClient'

export default serverRequest => {
  const { __SERVER__ } = process.env
  const axios = axiosInstance(serverRequest)

  const send = apiRequest => {
    // console.log('apiRequest', apiRequest)
    if (__SERVER__) {
      console.log('server')
      // If this is running on the server perform an http request
      return axios.post('', apiRequest).then(response => console.log(response.data))
    }

    console.log('websocket')
    // otherwise use the websocket
    const ws = webSocket('ws://api.eventhive.local/ws')

    ws.subscribe(
      message => console.log('Message: ', message),
      err => console.error('Error: ', err),
      () => console.warn('Completed!')
    )

    ws.next(apiRequest)

    return Promise.resolve()
  }

  return { send }
}
