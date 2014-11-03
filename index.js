module.exports = glBufferSnoop

var settings = {
    value: null
  , configurable: true
  , enumerable: true
}

function glBufferSnoop(gl) {
  var _deleteBuffer  = gl.deleteBuffer
  var _bufferSubData = gl.bufferSubData
  var _bufferData    = gl.bufferData
  var _bindBuffer    = gl.bindBuffer

  var stored = {}

  stored[gl.ARRAY_BUFFER] = null
  stored[gl.ELEMENT_ARRAY_BUFFER] = null

  gl.bindBuffer = function(target, buffer) {
    stored[target] = buffer
    return _bindBuffer.call(gl, target, buffer)
  }

  gl.bufferSubData = function(target, offset, data) {
    var buffer = stored[target]
    if (buffer && buffer._data) {
      var uploadData = new Uint8Array(data.buffer)
      var bufferData = buffer._data
      var i = offset
      var j = 0

      while (j < uploadData.length && i < bufferData.length) {
        bufferData[i++] = uploadData[j++]
      }
    }

    return _bufferSubData.call(gl, target, offset, data)
  }

  gl.bufferData = function(target, data, usage) {
    var buffer = stored[target]
    if (buffer) {
      settings.value = new Uint8Array(data.buffer || data)
      Object.defineProperty(buffer, '_data', settings)
      settings.value = null
    }

    return _bufferData.call(gl, target, data, usage)
  }

  gl.deleteBuffer = function(buffer) {
    Object.defineProperty(buffer, '_data', settings)
    return _deleteBuffer.call(gl, buffer)
  }

  gl.getBufferData = function(buffer) {
    return buffer._data || null
  }

  return gl
}
