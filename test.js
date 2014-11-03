var test = require('tape')

var canvas = document.createElement('canvas')
var gl     = canvas.getContext('webgl') || canvas.getContext('webgl-experimental')
var data1  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var data2  = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

require('./')(gl)

test('gl.bufferData(gl.ARRAY_BUFFER, ...)', function(t) {
  var buffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data1), gl.DYNAMIC_DRAW)

  t.deepEqual(
      new Float32Array(gl.getBufferData(buffer).buffer)
    , new Float32Array(data1)
    , 'snooped data matches initial input'
  )

  gl.deleteBuffer(buffer)
  t.end()
})

test('gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ...)', function(t) {
  var buffer = gl.createBuffer()

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(data1), gl.DYNAMIC_DRAW)

  t.deepEqual(
      new Float32Array(gl.getBufferData(buffer).buffer)
    , new Float32Array(data1)
    , 'snooped data matches initial input'
  )

  gl.deleteBuffer(buffer)
  t.end()
})

test('gl.bufferData(gl.ELEMENT_ARRAY_BUFFER && gl.ARRAY_BUFFER, ...)', function(t) {
  var array   = gl.createBuffer()
  var element = gl.createBuffer()

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, element)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(data1), gl.DYNAMIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, array)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data2), gl.DYNAMIC_DRAW)

  t.deepEqual(
      new Float32Array(gl.getBufferData(element).buffer)
    , new Float32Array(data1)
    , 'gl.ELEMENT_ARRAY_BUFFER\'s snooped data matches initial input'
  )

  t.deepEqual(
      new Float32Array(gl.getBufferData(array).buffer)
    , new Float32Array(data2)
    , 'gl.ARRAY_BUFFER\'s snooped data matches initial input'
  )

  gl.deleteBuffer(element)
  gl.deleteBuffer(array)
  t.end()
})

test('gl.deleteBuffer(...)', function(t) {
  var buffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data1), gl.DYNAMIC_DRAW)

  t.ok(gl.getBufferData(buffer), 'buffer initially has data')
  gl.deleteBuffer(buffer)
  t.ok(gl.getBufferData(buffer) === null, 'buffer data set to null on deletion')
  t.end()
})

test('gl.bufferSubData(gl.ARRAY_BUFFER)', function(t) {
  var buffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data1), gl.DYNAMIC_DRAW)
  t.deepEqual(
      new Float32Array(gl.getBufferData(buffer).buffer)
    , new Float32Array(data1)
    , 'snooped data matches initial input'
  )

  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([-1, -2]))
  t.deepEqual(
      new Float32Array(gl.getBufferData(buffer).buffer)
    , new Float32Array([-1, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    , 'should upload data correctly without offset'
  )

  gl.bufferSubData(gl.ARRAY_BUFFER, 20, new Float32Array([-3, -4]))
  t.deepEqual(
      new Float32Array(gl.getBufferData(buffer).buffer)
    , new Float32Array([-1, -2, 2, 3, 4, -3, -4, 7, 8, 9, 10])
    , 'should upload data correctly with offset'
  )

  gl.deleteBuffer(buffer)
  t.end()
})

test('shutdown', function(t) {
  t.end()
  setTimeout(function() { window.close() })
})
