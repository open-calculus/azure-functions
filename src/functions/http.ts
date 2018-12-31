import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'

import { fetch, Headers } from 'undici'

export const handler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  context.log('request url', request.url)
  let url = new URL(request.url)
  url.protocol = 'https:'
  url.host = 'www.google.com'
  url.port = ''
  let request_headers = new Headers(request.headers)
  request_headers.set('host', url.host)
  request_headers.set('referer', url.protocol + '//' + url.host)
  let response = await fetch(url, {
    headers: request_headers,
    method: request.method,
    body: request.body,
  })
  if (response.status == 204) {
    return { status: 500 }
  }
  let response_headers = new Headers(response.headers)
  response_headers.delete('clear-site-data')
  response_headers.delete('content-encoding')
  response_headers.delete('content-length')
  response_headers.delete('content-security-policy-report-only')
  response_headers.delete('content-security-policy')
  response_headers.delete('transfer-encoding')
  response_headers.set('access-control-allow-origin', '*')
  response_headers.set('access-control-allow-credentials', 'true')
  return {
    headers: response_headers,
    status: response.status,
    body: response.body,
  }
}

app.http('handler', {
  methods: [
    'GET',
    'POST',
    'DELETE',
    'HEAD',
    'PATCH',
    'PUT',
    'OPTIONS',
    'TRACE',
    'CONNECT',
  ],
  route: '/{**route}',
  handler: handler,
})
