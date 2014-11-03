# gl-buffer-snoop
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
![](http://img.shields.io/npm/v/gl-buffer-snoop.svg?style=flat)
![](http://img.shields.io/npm/dm/gl-buffer-snoop.svg?style=flat)
![](http://img.shields.io/npm/l/gl-buffer-snoop.svg?style=flat)

Intercepts uploads to WebGL buffers in order to keep track of their expected
value on the GPU.

Designed solely with the intention of testing packages that interact with
WebGL buffers. It's probably not something you should be using in an actual
app/demo, so approach with caution.

## Usage

[![NPM](https://nodei.co/npm/gl-buffer-snoop.png)](https://nodei.co/npm/gl-buffer-snoop/)

### `snoop(gl)`

Before using your WebGL context at all, you should let `gl-buffer-snoop` do
its thing by passing it the context in question:

``` javascript
var canvas = document.createElement('canvas')
var gl = canvas.getContext('webgl')

require('gl-buffer-snoop')(gl)
```

This will override a few of the context's methods to keep track of outgoing
data, along with providing a new method for you to use to retrieve a buffer's
data:

### `gl.getBufferData(buffer)`

Given an instance of a `WebGLBuffer`, returns our local copy of the data it
should have stored on the GPU. This is returned as a `Uint8Array`, but you
can easily convert it to other types too thanks to the magic of typed arrays.
For example:

``` javascript
var buffer = gl.createBuffer()
// ...
var rawData = gl.getBufferData(buffer)
var floatData = new Float32Array(rawData.buffer)
```

If you're using this with [gl-buffer](http://github.com/stackgl/gl-buffer),
you can just use the `handle` property to access the underlying buffer instance:

``` javascript
var buffer = require('gl-buffer')(gl, [1, 2, 3])
var rawData = gl.getBufferData(buffer.handle)
var floatData = new Float32Array(rawData.buffer)

console.log(floatData) // [1, 2, 3]
```

## License

MIT. See [LICENSE.md](http://github.com/stackgl/gl-buffer-snoop/blob/master/LICENSE.md)
for details.
