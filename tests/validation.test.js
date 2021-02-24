const { validateRoute } = require('../src/runtime')

test('not an array', function () {
  try {
    validateRoute({})
  } catch (err) {
    expect(err.message).toBe('Route is not an array, please check the documentation')
  }
  try {
    validateRoute(undefined)
  } catch (err) {
    expect(err.message).toBe('Route is not an array, please check the documentation')
  }
  try {
    validateRoute(null)
  } catch (err) {
    expect(err.message).toBe('Route is not an array, please check the documentation')
  }
})

test('invalid array', function () {
  try {
    validateRoute([])
  } catch (err) {
    expect(err.message).toBe('Route array is empty')
  }

  try {
    validateRoute([{}, {}])
  } catch (err) {
    expect(err.message).toBe('Route object in array is empty')
  }

  try {
    validateRoute([{ a: 1 }, { b: 2 }])
  } catch (err) {
    expect(err.message).toBe('Object doesn\'t contain the required attributes')
  }

  try {
    validateRoute([{ a: 1, b: 2, c: 3 }])
  } catch (err) {
    expect(err.message).toBe('Pattern attribute is required')
  }

  try {
    validateRoute([{ pattern: 1, b: 2, c: 3 }])
  } catch (err) {
    expect(err.message).toBe('Method attribute is required')
  }

  try {
    validateRoute([{ pattern: 1, method: 2, c: 3 }])
  } catch (err) {
    expect(err.message).toBe('Exec attribute is required')
  }
})

test('validate object attribute pattern definition', function () {
  try {
    validateRoute([{ pattern: 1, method: 2, exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('Pattern should be a string in the pattern /path/path2/:param')
  }

  try {
    validateRoute([{ pattern: 'path', method: 2, exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('Pattern should be a string in the pattern /path/path2/:param')
  }

  try {
    validateRoute([{ pattern: '/path{', method: 2, exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('Pattern should be a string in the pattern /path/path2/:param')
  }

  try {
    validateRoute([{ pattern: '/path}', method: 2, exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('Pattern should be a string in the pattern /path/path2/:param')
  }
})

test('validate object attribute method definition', function () {
  try {
    validateRoute([{ pattern: '/path', method: 2, exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('The only methods supported are GET,POST,PUT,DELETE')
  }

  try {
    validateRoute([{ pattern: '/path', method: 'x', exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('The only methods supported are GET,POST,PUT,DELETE')
  }

  try {
    validateRoute([{ pattern: '/path', method: 'get', exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('The only methods supported are GET,POST,PUT,DELETE')
  }

  try {
    validateRoute([{ pattern: '/path', method: 'post', exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('The only methods supported are GET,POST,PUT,DELETE')
  }

  try {
    validateRoute([{ pattern: '/path', method: 'put', exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('The only methods supported are GET,POST,PUT,DELETE')
  }

  try {
    validateRoute([{ pattern: '/path', method: 'delete', exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('The only methods supported are GET,POST,PUT,DELETE')
  }
})

test('validate object attribute exec definition', function () {
  try {
    validateRoute([{ pattern: '/path', method: 'GET', exec: 3 }])
  } catch (err) {
    expect(err.message).toBe('Exec should be a function')
  }
})

test('success', function () {
  const response = validateRoute([{ pattern: '/path', method: 'GET', exec: () => {} }])
  expect(response).toBe(true)
})