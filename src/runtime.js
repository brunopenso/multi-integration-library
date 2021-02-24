const util = require('./util')

async function runtime (routes, request, response) {
  try {
    if (!routes || routes.length === 0) {
      throw new Error('Routes object is empty')
    }
    await routeTo(routes, request, response)
  } catch (err) {
    response.status(500).send({ message: 'integration error', error: err.message })
  }
}

async function routeTo (routes, request, response) {
  const requestParams = util.parseHttpRequest(request)
  requestParams.pathParamsAttr = {}
  let routeToExecute
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]

    if (route.method !== requestParams.method) {
      continue
    }

    if (route.pattern === requestParams.path) {
      routeToExecute = route
      break
    } else if (route.pattern.indexOf(':') !== -1) {
      const requestPath = util.parsePath(requestParams.path)
      const patternPath = util.parsePath(route.pattern)
      if (requestPath.length === patternPath.length) {
        let match = 0
        for (let j = 0; j < patternPath.length; j++) {
          if (patternPath[j] === requestPath[j]) {
            match++
            continue
          } else if (patternPath[j].indexOf(':') !== -1) {
            match++
            requestParams.pathParamsAttr[patternPath[j].substring(1)] = requestPath[j]
          } else {
            break
          }
        }

        if (match === patternPath.length) {
          routeToExecute = route
        }
      }
    }
  }
  if (routeToExecute) {
    let data
    try {
      data = await routeToExecute.exec(requestParams)
    } catch (err) {
      throw new Error(`Error not handled in implementation. Message: ${err.message}`)
    }
    if (!data) {
      console.log('Integration method returned with no data')
      response.status(201).send()
    }
    if (!data.body) {
      data.body = ''
    }

    util.setHttpResponseHeaders(response, data.headers)
    if (!data.statusCode) {
      throw new Error('Status code or body is invalid')
    }
    response.status(data.statusCode).send(data.body)
  } else {
    response.status(400).send({ message: 'invalid path' })
  }
}

function createResponse (body, headers, errorCode) {
  return {
    statusCode: errorCode,
    body,
    headers
  }
}

function validateRoute (routes) {
  if (!Array.isArray(routes)) {
    throw new Error('Route is not an array, please check the documentation')
  }
  if (routes.length === 0) {
    throw new Error('Route array is empty')
  }

  routes.forEach((element) => {
    const keys = Object.keys(element).length
    if (keys === 0) {
      throw new Error('Route object in array is empty')
    } else if (keys !== 3) {
      throw new Error('Object doesn\'t contain the required attributes')
    } else {
      if (element.pattern === undefined) {
        throw new Error('Pattern attribute is required')
      }
      if (element.method === undefined) {
        throw new Error('Method attribute is required')
      }
      if (element.exec === undefined) {
        throw new Error('Exec attribute is required')
      }
      validatePattern(element.pattern)
      validateMethod(element.method)
      validateExec(element.exec)
    }
  })
  return true
}

function validatePattern (pattern) {
  const defaultMessage = 'Pattern should be a string in the pattern /path/path2/:param'
  if (typeof pattern === 'string') {
    if (pattern.charAt(0) !== '/') {
      throw new Error(defaultMessage)
    }

    if (pattern.indexOf('{') >= 0 || pattern.indexOf('}') >= 0) {
      throw new Error(defaultMessage)
    }
  } else {
    throw new Error(defaultMessage)
  }
}
function validateMethod (method) {
  const methods = 'GET,POST,PUT,DELETE'
  if (methods.indexOf(method) === -1 || (typeof method !== 'string')) {
    throw new Error(`The only methods supported are ${methods}`)
  }
}
function validateExec (exec) {
  if (!({}.toString.call(exec) === '[object Function]')) {
    throw new Error('Exec should be a function')
  }
}

module.exports = {
  runtime,
  createResponse,
  validateRoute
}
