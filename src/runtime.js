async function execute(routes, request, response) {
    try {
        if (!routes || routes.length == 0) {
            throw new Error('Routes object is empty')
        }
        await routeTo(routes, request, response)
    } catch (err) {
        response.status(500).send({ message: 'integration error', error: err.message})
    }
}

async function routeTo(routes, request, response) {
    const requestParams = parse(request)
    requestParams.pathParamsAttr = {}
    let routeToExecute
    for(var i = 0; i < routes.length; i++) {
        const route = routes[i]
        if (route.method != requestParams.method) {
            continue;
        }

        if (route.pattern === requestParams.path) {
            routeToExecute = route
            break;
        } else if (route.pattern.indexOf(':') != -1) {
            const requestPath = parsePath(requestParams.path)
            const patternPath = parsePath(route.pattern)
            if (requestPath.length == patternPath.length) {
                let match = 0
                for(var j = 0; j < patternPath.length; j++) {
                    if (patternPath[j] == requestPath[j]) {
                        match++
                        continue
                    } else if (patternPath[j].indexOf(':') != -1){
                        match++
                        requestParams.pathParamsAttr[patternPath[j].substring(1)] = requestPath[j]
                    } else {
                        break
                    }
                }

                if (match == patternPath.length) {
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
            throw new Error('Integration method do not returned')
        }
        if (!data.body) {
            data.body = ''
        }
        
        setHeaders(response, data.headers)
        if (!data.statusCode) {
            throw new Error('Status code or body is invalid')
        }
        response.status(data.statusCode).send(data.body)
    } else {
        response.status(400).send({ message: 'invalid path'})
    }
}

function parseUrl(requestUrl) {
    let url = requestUrl.replace(/\/\//g, '/')
    //get the value from the url before ?
    let indexOf = url.lastIndexOf('?')
    if (indexOf != -1)
        url = url.substring(0, indexOf)
    //remove the last slash
    if (url.lastIndexOf('/') == url.length-1) {
        url = url.substring(0, url.length-1)
    }

    return url
}
function parsePath(url) {
    //separate all paths in  array
    let params = url.split('/')
    if (params.length == 1 && params[0] == '')
        params = undefined
    return params
}

function parse(request) {
    if (!request) {
        throw Error('invalid request object')
    }
    if (!request.url || request.url.length == 1 || !request.method) {
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

function setHeaders(response, headers) {
    if (headers) {
        const keys = Object.keys(headers)
        for (var i = 0; i < keys.length; i++) {
            response.set(keys[i], headers[keys[i]])
        }
    }
}

function createResponse(body, headers, errorCode) {
    return {
        statusCode: errorCode,
        body,
        headers
    }
}
module.exports = {
    runtime: execute,
    createResponse
}