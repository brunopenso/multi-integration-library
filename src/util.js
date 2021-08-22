/*
 * Parse request url after the domain and before de ?
 */
function parseUrl (requestUrl) {
  let url = requestUrl.replace(/\/\//g, '/')
  // get the value from the url before ?
  const indexOf = url.lastIndexOf('?')
  if (indexOf !== -1) { url = url.substring(0, indexOf) }
  // remove the last slash
  if (url.lastIndexOf('/') === url.length - 1) {
    url = url.substring(0, url.length - 1)
  }

  return url
}
/*
 * Parse the path in an array
 */
function parsePath (url) {
  // separate all paths in  array
  let params = url.split('/')
  if (params.length === 1 && params[0] === '') { params = undefined }
  return params
}

/*
 * Regardless the runtinme this method get url, body, query strings and header and normalize it to a object
 * AWS Lambda: TBD
 * Google Cloud Functions: TBD
 */
function parseHttpRequest (runtime, request) {
  const providers = 'express;fastify;googlecloudfunction'
  if (providers.indexOf(runtime) === -1) {
    throw new Error(`Only the follow providers are available ${providers}`)
  }
  if (!request) {
    throw Error('invalid request object')
  }
  if (!request.url || request.url.length === 1 || !request.method) {
    throw Error('Path/Method of the API not found')
  }
  const url = parseUrl(request.url)
  return {
    path: url,
    method: request.method,
    queryString: request.query,
    body: request.body,
    headers: request.headers
  }
}

/*
 * Interate over a list of headers and add all of than to the Http Response
 */
function setHttpResponseHeaders (response, headers) {
  if (headers) {
    const keys = Object.keys(headers)
    for (const key of keys) {
      response.set(key, headers[key])
    }
  }
}

module.exports = {
  parseUrl,
  parsePath,
  parseHttpRequest,
  setHttpResponseHeaders
}
