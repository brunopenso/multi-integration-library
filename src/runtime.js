const util = require('./util')

/*
 * Entry point for this library
 * @param {Array} routes - The list of routes
 * @param {HttpRequest} request
 * @param {HttpResponse} response
 * @param {String} provider - The type of tecnology running this code. Default: express
 */
async function runtime (routes, request, response, provider = 'express') {
  try {
    if (!routes || routes.length === 0) {
      throw new Error('Routes object is empty')
    }
    await routeTo(routes, request, response, provider)
  } catch (err) {
    console.log(JSON.stringify(err))
    response.status(500).send({ message: 'integration error', error: err.message })
  }
}
/*
 * Parse the url and call the method in the routes
 */
async function routeTo (routes, request, response, provideer) {
  const requestParams = util.parseHttpRequest(provideer, request)
  requestParams.pathParamsAttr = {}
  let routeToExecute

  for (const route of routes) {
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
          }
          if (patternPath[j].indexOf(':') !== -1) {
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
    let responseData
    try {
      responseData = await routeToExecute.exec(requestParams)
    } catch (err) {
      throw new Error(`Error not handled in implementation. Message: ${err.message}`)
    }
    if (!responseData) {
      console.log('Integration method returned with no data')
      response.status(201).send()
      return
    }
    if (!responseData.body) {
      responseData.body = ''
    }

    util.setHttpResponseHeaders(response, responseData.headers)
    if (!responseData.statusCode) {
      throw new Error('Status code or body is invalid')
    }
    response.status(responseData.statusCode).send(responseData.body)
  } else {
    response.status(400).send({ message: 'invalid path' })
  }
}
/*
 * Create a response message
 */
function createResponse (body, headers, errorCode) {
  return {
    statusCode: errorCode,
    body,
    headers
  }
}

/*
 * Validate the routes arrays if it is compliance to the library
 */
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

/*
 * Validate route pattern
 */
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

/*
 * Validate http method
 */
function validateMethod (method) {
  const methods = 'GET,POST,PUT,DELETE,PATCH'
  if (methods.indexOf(method) === -1 || (typeof method !== 'string')) {
    throw new Error(`The only methods supported are ${methods}`)
  }
}

/*
 * Validate function of exec parameter
 */
function validateExec (exec) {
  if (({}.toString.call(exec) !== '[object Function]')) {
    throw new Error('Exec should be a function')
  }
}

module.exports = {
  runtime,
  createResponse,
  validateRoute
}
