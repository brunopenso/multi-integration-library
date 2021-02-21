const { runtime, createResponse } = require('../src/runtime')

const mockRequest = (url, method, body) => ({
    url,
    method,
    body,
});

const mockRequestQueryString = (url, method, body, query) => ({
    url,
    method,
    body,
    query
});
  
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    return res;
};

test('undefined path', async function() {
    var req = mockRequest(undefined,undefined, undefined)
    var res = mockResponse()
    await runtime([{}], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Path/Method of the API not found'});
})

test('path empty', async function() {
    var req = mockRequest('',undefined, undefined)
    var res = mockResponse()
    await runtime([{}], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Path/Method of the API not found'});
})

test('path with /', async function() {
    var req = mockRequest('/',undefined, undefined)
    var res = mockResponse()
    await runtime([{}], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Path/Method of the API not found'});
})

test('path with /a no method', async function() {
    var req = mockRequest('/a',undefined, undefined)
    var res = mockResponse()
    await runtime([{}], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Path/Method of the API not found'});
})

test('path with /a get no route data', async function() {
    var req = mockRequest('/a','get', undefined)
    var res = mockResponse()
    await runtime([{}], req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({ message: 'invalid path' });
})

test('empty routes', async function() {
    var req = mockRequest('/a','get', undefined)
    var res = mockResponse()
    await runtime([], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Routes object is empty' });
})

test('path with /a get with route data wrong method', async function() {
    var req = mockRequest('/a','POST', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => {}
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({ message: 'invalid path' });
})

test('path /a empty no return', async function() {
    var req = mockRequest('/a','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => {}
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Integration method do not returned' });
})

test('path /a empty return', async function() {
    var req = mockRequest('/a','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return {} }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Status code or body is invalid' });
})

test('path /a return data', async function() {
    var req = mockRequest('/a','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse(undefined, undefined, undefined) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: 'integration error', error: 'Status code or body is invalid' });
})

test('path /a return status code', async function() {
    var req = mockRequest('/a','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ });
})

test('path /a return status code', async function() {
    var req = mockRequest('/a','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ });
})


test('2 routes', async function() {
    var req = mockRequest('/a/b','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({route: 'a'}, undefined, 200) }
    },
    {
        "pattern": "/a/b",
        "method": "get",
        "exec": (params) => { return createResponse({route: 'a/b'}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({route: 'a/b'});
})

test('3 routes with path param', async function() {
    var req = mockRequest('/a/23/b','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({route: 'a'}, undefined, 200) }
    },
    {
        "pattern": "/a/:id/b",
        "method": "get",
        "exec": (params) => { return createResponse({id: params.pathParamsAttr.id}, undefined, 200) }
    },
    {
        "pattern": "/a/b",
        "method": "get",
        "exec": (params) => { return createResponse({route: 'a/b'}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ id:"23" });
})

test('multi path params', async function() {
    var req = mockRequest('/car/23/engine/ADE567/type','GET', undefined)
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({route: 'a'}, undefined, 200) }
    },
    {
        "pattern": "/a/:id/b",
        "method": "get",
        "exec": (params) => { return createResponse({id: params.pathParamsAttr.id}, undefined, 200) }
    },
    {
        "pattern": "/a/b",
        "method": "get",
        "exec": (params) => { return createResponse({route: 'a/b'}, undefined, 200) }
    },
    {
        "pattern": "/car/:id/engine/:engineCode/type",
        "method": "get",
        "exec": (params) => { return createResponse({id: params.pathParamsAttr.id, engine: params.pathParamsAttr.engineCode}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ id:"23", engine: "ADE567" });
})

test('path with query param', async function() {
    var req = mockRequestQueryString('/a?test=123','GET', undefined, { test: "123" })
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({test: params.queryString.test}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ test: "123"});
})

test('path with query param with last slash', async function() {
    var req = mockRequestQueryString('/a/?test=123','GET', undefined, { test: "123" })
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({test: params.queryString.test}, undefined, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ test: "123"});
})

test('path with query param with last slash with headers', async function() {
    var req = mockRequestQueryString('/a/?test=123','GET', undefined, { test: "123" })
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { return createResponse({test: params.queryString.test}, { t: 1, x:2}, 200) }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ test: "123"});
    expect(res.set).toHaveBeenCalledWith('t', 1)
    expect(res.set).toHaveBeenCalledWith('x', 2)
})

test('method not implemented', async function() {
    var req = mockRequestQueryString('/a/?test=123','GET', undefined, { test: "123" })
    var res = mockResponse()
    await runtime([{
        "pattern": "/a",
        "method": "get",
        "exec": (params) => { throw new Error('not implemented') }
    }], req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: "integration error", error: "Error not handled in implementation. Message: not implemented" });
})