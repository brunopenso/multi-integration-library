const { runtime, validateRoute, createResponse } = require('../src/runtime')
const httpMocks = require('node-mocks-http')

const myMock = jest.fn()
myMock.mockResolvedValue(createResponse(200, {}, {}))

const routes = [
  {
    pattern: '/todo',
    method: 'GET',
    exec: myMock
  },
  {
    pattern: '/todo/:id',
    method: 'GET',
    exec: myMock
  },
  {
    pattern: '/todo/:id/checkList',
    method: 'GET',
    exec: myMock
  }
]

validateRoute(routes)

const mockResp = httpMocks.createResponse()

test('GET /test', async function () {
  myMock.mockClear()

  const mockReq = httpMocks.createRequest({
    method: 'GET',
    url: '/test'
  })

  await runtime(routes, mockReq, mockResp)

  expect(myMock.mock.calls.length).toBe(0)
})

test('GET /todo', async function () {
  myMock.mockClear()
  const path = '/todo'

  const mockReq = httpMocks.createRequest({
    method: 'GET',
    url: path
  })

  await runtime(routes, mockReq, mockResp)

  expect(myMock.mock.calls.length).toBe(1)
  expect(myMock.mock.calls[0][0].path).toBe(path)
})

test('GET /todo/123', async function () {
  myMock.mockClear()
  const path = '/todo/123'

  const mockReq = httpMocks.createRequest({
    method: 'GET',
    url: path
  })

  await runtime(routes, mockReq, mockResp)

  expect(myMock.mock.calls.length).toBe(1)
  expect(myMock.mock.calls[0][0].path).toBe(path)
})

test('GET /todo/123/checklist', async function () {
  myMock.mockClear()
  const path = '/todo/123/checkList'

  const mockReq = httpMocks.createRequest({
    method: 'GET',
    url: path
  })

  await runtime(routes, mockReq, mockResp)

  expect(myMock.mock.calls.length).toBe(1)
  expect(myMock.mock.calls[0][0].path).toBe(path)
})

test('GET /todo?search=abc', async function () {
  myMock.mockClear()
  const path = '/todo'

  const mockReq = httpMocks.createRequest({
    method: 'GET',
    url: path,
    query: {
      search: 'abc'
    }
  })

  await runtime(routes, mockReq, mockResp)

  expect(myMock.mock.calls.length).toBe(1)
  expect(myMock.mock.calls[0][0].path).toBe(path)
  expect(myMock.mock.calls[0][0].queryString.search).toBe('abc')
})
