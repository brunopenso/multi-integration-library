const { validateRoute } = require('../src/runtime')

afterEach(jest.restoreAllMocks)

describe('not an array', () => {
  const errorMessage = 'Route is not an array, please check the documentation'
  test('simple object', async () => {
    await expect(async () => {
      validateRoute({})
    }).rejects.toThrow(errorMessage)
  })
  test('object = undefined', async () => {
    await expect(async () => {
      validateRoute(undefined)
    }).rejects.toThrow(errorMessage)
  })
  test('object = null', async () => {
    await expect(async () => {
      validateRoute(null)
    }).rejects.toThrow(errorMessage)
  })
})

describe('invalid array', () => {
  test('array is empty', async () => {
    await expect(async () => {
      validateRoute([])
    }).rejects.toThrow('Route array is empty')
  })
  test('route object is empty', async () => {
    await expect(async () => {
      validateRoute([{}, {}])
    }).rejects.toThrow('Route object in array is empty')
  })
  test('object with no attributes', async () => {
    await expect(async () => {
      validateRoute([{ a: 1 }, { b: 2 }])
    }).rejects.toThrow('Object doesn\'t contain the required attributes')
  })
  test('patter attribute missing', async () => {
    await expect(async () => {
      validateRoute([{ a: 1, b: 2, c: 3 }])
    }).rejects.toThrow('Pattern attribute is required')
  })
  test('method attribute missing', async () => {
    await expect(async () => {
      validateRoute([{ pattern: 1, b: 2, c: 3 }])
    }).rejects.toThrow('Method attribute is required')
  })
  test('exec attribute missing', async () => {
    await expect(async () => {
      validateRoute([{ pattern: 1, method: 2, c: 3 }])
    }).rejects.toThrow('Exec attribute is required')
  })
})

describe('validate object attribute pattern definition', () => {
  test('pattern must be string', async () => {
    await expect(async () => {
      validateRoute([{ pattern: 1, method: 2, exec: 3 }])
    }).rejects.toThrow('Pattern should be a string in the pattern /path/path2/:param')
  })
  test('string pattern invalid', async () => {
    await expect(async () => {
      validateRoute([{ pattern: 'path', method: 2, exec: 3 }])
    }).rejects.toThrow('Pattern should be a string in the pattern /path/path2/:param')
  })
  test('string pattern invalid chars {', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path{', method: 2, exec: 3 }])
    }).rejects.toThrow('Pattern should be a string in the pattern /path/path2/:param')
  })
  test('string pattern invalid chars }', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path}', method: 2, exec: 3 }])
    }).rejects.toThrow('Pattern should be a string in the pattern /path/path2/:param')
  })
})

describe('validate object attribute method definition', () => {
  const errorMessage = 'The only methods supported are GET,POST,PUT,DELETE,PATCH'
  test('method as number', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path', method: 2, exec: 3 }])
    }).rejects.toThrow(errorMessage)
  })
  test('method with x', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path', method: 'x', exec: 3 }])
    }).rejects.toThrow(errorMessage)
  })
  test('methd lowercase get', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path', method: 'get', exec: 3 }])
    }).rejects.toThrow(errorMessage)
  })
  test('methd lowercase post', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path', method: 'post', exec: 3 }])
    }).rejects.toThrow(errorMessage)
  })
  test('methd lowercase put', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path', method: 'put', exec: 3 }])
    }).rejects.toThrow(errorMessage)
  })
  test('methd lowercase delete', async () => {
    await expect(async () => {
      validateRoute([{ pattern: '/path', method: 'delete', exec: 3 }])
    }).rejects.toThrow(errorMessage)
  })
})

test('validate object attribute exec definition', async () => {
  await expect(async () => {
    validateRoute([{ pattern: '/path', method: 'GET', exec: 3 }])
  }).rejects.toThrow('Exec should be a function')
})

test('success', function () {
  const response = validateRoute([{ pattern: '/path', method: 'GET', exec: () => {} }])
  expect(response).toBe(true)
})
