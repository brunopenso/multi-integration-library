
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
function parsePath (url) {
  // separate all paths in  array
  let params = url.split('/')
  if (params.length === 1 && params[0] === '') { params = undefined }
  return params
}

function parseHttpRequest (request) {
  if (!request) {
    throw Error('invalid request object')
  }
  if (!request.url || request.url.length === 1 || !request.method) {
    throw Error('Path/Method of the API not found')
  }
  const url = parseUrl(request.url)
  return {
    path: url,
    method: request.method.toLowerCase(),
    queryString: request.query,
    body: request.body,
    headers: request.headers
  }
}

function setHttpResponseHeaders (response, headers) {
  if (headers) {
    const keys = Object.keys(headers)
    for (let i = 0; i < keys.length; i++) {
      response.set(keys[i], headers[keys[i]])
    }
  }
}

module.exports = {
  parseUrl,
  parsePath,
  parseHttpRequest,
  setHttpResponseHeaders
}