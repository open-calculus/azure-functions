import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'

export const handler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  context.log('request url', request.url)
  return { body: request.url }
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
