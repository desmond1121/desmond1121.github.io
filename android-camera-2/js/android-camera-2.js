(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * Created by brian on 19/07/2017.
 */





var EVT_AR_ERROR = 'error';

var EVT_CAMERA_OPEN = 'open';

var EVT_CAMERA_CLOSE = 'close';

var EVT_CAMERA_PAUSE = 'pause';

var EVT_CAMERA_RESUME = 'resume';









var CAMERA_QUALITY_DEFAULT = 3;



var CAMERA_FACING_BACK = 0;

var CAMERA_FACING_FRONT = 1;

var EVT_BEFORE_RENDER = 'before-render';

var EVT_AFTER_RENDER = 'after-render';

var EVT_RENDER_PAUSE = 'render-pause';

var EVT_RENDER_RESUME = 'render-resume';

/**
 * Created by brian on 11/08/2017.
 */
var ERROR_CODE_CAMERA_ERROR_OCCUPIED = 10;

// most from android
var ERROR_CODE_CAMERA_OPEN_FAILED = 11;

var ERROR_CODE_USER_DENIED = 12;

var ERROR_CODE_NO_NATIVE_API = 13;

var ERROR_CODE_UNKNOWN = 14;

var ERROR_CODE_INVALID_RENDER_TARGET = 15;

var ERROR_CODE_NO_CAMERA_DEVICE = 16;

/**
 * Created by brian on 22/08/2017.
 */
function makeError(code, reason) {
  return {
    code: code, reason: reason
  };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Created by brian on 07/08/2017.
 */
function isFunc(func) {
  return typeof func === "function";
}
function isObj(any) {
  return (typeof any === 'undefined' ? 'undefined' : _typeof(any)) === 'object' && any;
}
var seed = Math.round(Math.random() * 100);
function createSymbol(name) {
  return name + '_' + seed++;
}

/**
 * Created by brian on 19/07/2017.
 */
function isAndroid() {
  return (/Android\s+\d+\.\d+/.test(navigator.userAgent)
  );
}
function isiOS() {
  return (/iPhone|iPad/.test(navigator.userAgent)
  );
}
function whenWebARPluginReady() {
  return new Promise(function (resolve, reject) {
    if (isAndroid()) {
      if (getUCARSession()) {
        return resolve();
      }
      return reject({ error: ERROR_CODE_NO_NATIVE_API });
    } else {
      var bridgeReady = function bridgeReady() {
        window.AlipayJSBridge.call('initWebAR', function (e) {
          var error = e.error;
          error ? reject(makeError(error == 11 ? ERROR_CODE_USER_DENIED : ERROR_CODE_NO_NATIVE_API, error)) : resolve();
        });
      };

      if (window.AlipayJSBridge) {
        window.AlipayJSBridge.WebCamera ? resolve() : bridgeReady();
      } else {
        document.addEventListener('AlipayJSBridgeReady', bridgeReady, false);
      }
    }
  });
}
var videoSizes = [0, 240, 360, 480, 720];
function getVideoSizeFromQuality(quality) {
  return videoSizes[quality] || videoSizes[CAMERA_QUALITY_DEFAULT];
}
function getCameraWebRTCFacing(facing) {
  return facing == CAMERA_FACING_BACK ? 'environment' : 'user';
}

var session = void 0;

function getUCARSession() {
  if (session) {
    return session;
  }
  if (window.ARSession) {
    session = window.ARSession;
    session.version = 2;
  } else if (window.ucweb) {
    session = window.ucweb.ARSession;
    session.version = 1;
  }
  return session;
}

/**
 * Created by brian on 01/09/2017.
 */
var NativeCamera = function () {
  function NativeCamera(facing, quality) {
    classCallCheck(this, NativeCamera);

    this.facing = facing;
    this.quality = quality;
  }

  createClass(NativeCamera, [{
    key: "lock",
    value: function lock() {}
  }, {
    key: "unlock",
    value: function unlock() {}
  }, {
    key: "start",
    value: function start() {}
  }, {
    key: "stop",
    value: function stop() {}
  }, {
    key: "getCurrentFrames",
    value: function getCurrentFrames() {
      return [];
    }
  }, {
    key: "isSame",
    value: function isSame(facing, quality) {
      return this.facing == facing && this.quality == quality;
    }
  }, {
    key: "isRunning",
    get: function get$$1() {
      return false;
    }
  }, {
    key: "isDirty",
    get: function get$$1() {
      return false;
    }
  }]);
  return NativeCamera;
}();

var _FACING_KEY_WORDS;

/**
 * Created by brian on 20/07/2017.
 */
var FACING_KEY_WORDS = (_FACING_KEY_WORDS = {}, defineProperty(_FACING_KEY_WORDS, CAMERA_FACING_BACK, 'back'), defineProperty(_FACING_KEY_WORDS, CAMERA_FACING_FRONT, 'front'), _FACING_KEY_WORDS);

var UCCamera = function (_NativeCamera) {
  inherits(UCCamera, _NativeCamera);

  function UCCamera(facing, quality) {
    classCallCheck(this, UCCamera);

    var _this = possibleConstructorReturn(this, (UCCamera.__proto__ || Object.getPrototypeOf(UCCamera)).call(this, facing, quality));

    _this.session = getUCARSession();
    return _this;
  }

  createClass(UCCamera, [{
    key: 'getCurrentFrames',
    value: function getCurrentFrames() {
      return this.session.getCurrentFrames();
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return this.session.isRunning;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      return this.session.isDirty && this.session.getCurrentFrames().length > 0;
    }
  }]);
  return UCCamera;
}(NativeCamera);

function startARSessionAsync(constraint) {
  var detectorName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'MarkerDetector';

  return new Promise(function (resolve, reject) {
    var arSession = getUCARSession();
    if (!arSession) {
      reject(makeError(ERROR_CODE_NO_NATIVE_API));
    } else {
      addEventListenerOnce(arSession, 'SessionStart', function () {
        var detector = arSession.currentDetector;
        if (!detector) {
          detector = arSession.currentDetector = arSession.setDetector(detectorName);
        }
        resolve(detector);
      });
      addEventListenerOnce(arSession, 'SessionFail', function (e) {
        if (/('|")errorCode\1:(\d+)/.test(e)) {
          var code = RegExp.$2 == 0 ? ERROR_CODE_USER_DENIED : ERROR_CODE_CAMERA_OPEN_FAILED;
          reject(makeError(code, e));
        } else {
          reject(makeError(ERROR_CODE_UNKNOWN, e));
        }
      });
      arSession.start(constraint);
    }
  });
}

function stopARSessionAsync() {
  return new Promise(function (resolve) {
    var arSession = getUCARSession();
    if (!arSession || !arSession.isRunning) {
      resolve();
    } else {
      arSession.stop();
      addEventListenerOnce(arSession, 'SessionStop', resolve);
    }
  });
}

function getMediaConstraintAsync(facing, quality) {
  var m57 = isObj(navigator.mediaDevices);
  facing = m57 ? FACING_KEY_WORDS[facing] : getCameraWebRTCFacing(facing);

  var minHeight = getVideoSizeFromQuality(quality);
  var constraint = void 0;
  if (m57) {
    return navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.some(findDeviceInfoM57);
      if (constraint) {
        return constraint;
      }
      throw makeError(devices.length ? ERROR_CODE_CAMERA_OPEN_FAILED : ERROR_CODE_NO_CAMERA_DEVICE);
    });
  }
  return new Promise(function (res, rej) {
    MediaStreamTrack.getSources(function (devices) {
      devices.some(findDeviceInfo);
      constraint ? res(constraint || {}) : rej(makeError(devices.length ? ERROR_CODE_CAMERA_OPEN_FAILED : ERROR_CODE_NO_CAMERA_DEVICE));
    });
  });

  function findDeviceInfo(deviceInfo) {
    if (deviceInfo.kind === 'video' && deviceInfo.facing === facing) {
      return constraint = {
        video: {
          mandatory: {
            sourceId: deviceInfo.id,
            minHeight: minHeight,
            minWidth: minHeight
          }
        }
      };
    }
  }

  function findDeviceInfoM57(deviceInfo) {
    if (deviceInfo.kind == 'videoinput' && deviceInfo.label.indexOf(facing) > 0) {
      return constraint = {
        video: {
          deviceId: deviceInfo.deviceId,
          width: { min: minHeight },
          height: { min: minHeight }
        }
      };
    }
  }
}

function addEventListenerOnce(target, evt, func) {
  var dispatched = void 0;
  target.addEventListener(evt, function once(e) {
    if (!dispatched) {
      func(e);
      dispatched = true;
    }
    setTimeout(function () {
      return target.removeEventListener(evt, once);
    }, 0);
  });
}

/**
 * Created by brian on 14/08/2017.
 */
var WebRTCCamera = function (_NativeCamera) {
  inherits(WebRTCCamera, _NativeCamera);

  function WebRTCCamera(facing, quality, stream) {
    classCallCheck(this, WebRTCCamera);

    var _this = possibleConstructorReturn(this, (WebRTCCamera.__proto__ || Object.getPrototypeOf(WebRTCCamera)).call(this, CAMERA_FACING_FRONT, quality));

    _this.video = document.createElement('video');
    _this.stream = stream;
    _this.__dirty = false;
    return _this;
  }

  createClass(WebRTCCamera, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var video = this.video;
      video.srcObject = this.stream;
      video.onloadedmetadata = function () {
        video.play();
        _this2.__dirty = true;
      };
    }
  }, {
    key: 'stop',
    value: function stop() {
      var stream = this.stream;
      var tracks = stream.getTracks();
      tracks.forEach(function (t) {
        return stream.removeTrack(t);
      });
    }
  }, {
    key: 'getCurrentFrames',
    value: function getCurrentFrames() {
      return this.video;
    }
  }, {
    key: 'isRunning',
    get: function get$$1() {
      return !this.video.paused;
    }
  }, {
    key: 'isDirty',
    get: function get$$1() {
      return this.__dirty;
    }
  }]);
  return WebRTCCamera;
}(NativeCamera);

function getMediaStreamAsync(facing, quality) {
  try {
    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: getCameraWebRTCFacing(facing),
        height: { min: getVideoSizeFromQuality(quality) }
      }
    }).catch(function (ex) {
      throw makeError(ex.name === "PermissionDeniedError" ? ERROR_CODE_USER_DENIED : ERROR_CODE_CAMERA_OPEN_FAILED, ex);
    });
  } catch (ex) {
    return Promise.reject(ex);
  }
}

/**
 * Created by brian on 01/09/2017.
 */
function createiOSNativeCamera(facing, quality) {
  var camera = new window.AlipayJSBridge.WebCamera({ facing: facing, quality: quality });
  camera.isSame = NativeCamera.prototype.isSame;
  return camera;
}

/**
 * Created by brian on 10/08/2017.
 */
var g_WebCameraService = void 0;
function getDefaultNativeCameraService() {
  if (!g_WebCameraService) {
    g_WebCameraService = new NativeCameraService();
  }
  return g_WebCameraService;
}
var NativeCameraService = function () {
  function NativeCameraService() {
    classCallCheck(this, NativeCameraService);

    this.__isiOS = isiOS();
    this.__isAndroid = isAndroid();
  }

  createClass(NativeCameraService, [{
    key: 'getNativeCameraAsync',
    value: function getNativeCameraAsync(facing, quality) {
      var _this = this;

      var nativeCamera = this.__nativeCamera;
      var pending = void 0;
      if (nativeCamera) {
        return nativeCamera.isSame(facing, quality) ? Promise.resolve(nativeCamera) : Promise.reject(makeError(ERROR_CODE_CAMERA_ERROR_OCCUPIED));
      }
      if (this.__isiOS) {
        pending = this.getiOSCameraAsync(facing, quality);
      } else if (this.__isAndroid) {
        pending = this.getUCCameraAsync(facing, quality);
      } else {
        pending = this.getWebRTCCameraAsync(facing, quality);
      }
      return pending.then(function (camera) {
        return _this.__nativeCamera = camera;
      });
    }
  }, {
    key: 'getWebRTCCameraAsync',
    value: function getWebRTCCameraAsync(facing, quality) {
      return getMediaStreamAsync(facing, quality).then(function (stream) {
        return new WebRTCCamera(facing, quality, stream);
      });
    }
  }, {
    key: 'getUCCameraAsync',
    value: function getUCCameraAsync(facing, quality) {
      return whenWebARPluginReady().then(function () {
        return stopARSessionAsync();
      }).then(function () {
        return getMediaConstraintAsync(facing, quality);
      }).then(startARSessionAsync).then(function () {
        return new UCCamera(facing, quality);
      });
    }
  }, {
    key: 'getiOSCameraAsync',
    value: function getiOSCameraAsync(facing, quality) {
      return whenWebARPluginReady().then(function () {
        return createiOSNativeCamera(facing, quality);
      });
    }
  }, {
    key: 'closeAsync',
    value: function closeAsync(_camera) {
      var _this2 = this;

      var camera = this.__nativeCamera;
      if (camera && camera === _camera) {
        if (this.__isAndroid) {
          return stopARSessionAsync().then(function () {
            _this2.__nativeCamera = null;
          });
        } else {
          camera.stop();
        }
      }
      this.__nativeCamera = null;
      return Promise.resolve();
    }
  }]);
  return NativeCameraService;
}();

/**
 * Created by brian on 02/12/2016.
 */
var WebGL_CONST = {};
if (isFunc(window.WebGLRenderingContext)) {
  var copyConst = function copyConst(source) {
    for (var name in source) {
      if (/^[A-Z_\d]+$/.test(name)) {
        WebGL_CONST[name] = source[name];
      }
    }
  };
  copyConst(WebGLRenderingContext);
  copyConst(WebGLRenderingContext.prototype);
  WebGL_CONST.HALF_FLOAT_OES = 36193;
}

/**
 * Created by brian on 17/07/2017.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function forEach(object, callback, thisObj) {
  if (isObj(object)) {
    if (thisObj === void 0) {
      thisObj = object;
    }
    if (object instanceof Array || 'length' in object) {
      Array.prototype.forEach.call(object, callback, thisObj);
    } else {
      for (var name in object) {
        if (hasOwnProperty.call(object, name)) {
          callback.call(thisObj, object[name], name);
        }
      }
    }
  }
  return object;
}

/**
 * Created by brian on 17/07/2017.
 */
var STATE_VARS = ['DEPTH_TEST', 'BLEND', 'CULL_FACE'];
var FLOAT = WebGL_CONST.FLOAT;
var SAMPLER_CUBE = WebGL_CONST.SAMPLER_CUBE;
var SAMPLER_2D = WebGL_CONST.SAMPLER_2D;
var INT = WebGL_CONST.INT;
var BOOL = WebGL_CONST.BOOL;
var FLOAT_VEC4 = WebGL_CONST.FLOAT_VEC4;
var FLOAT_VEC3 = WebGL_CONST.FLOAT_VEC3;
var FLOAT_VEC2 = WebGL_CONST.FLOAT_VEC2;
var FLOAT_MAT2 = WebGL_CONST.FLOAT_MAT2;
var FLOAT_MAT3 = WebGL_CONST.FLOAT_MAT3;
var FLOAT_MAT4 = WebGL_CONST.FLOAT_MAT4;


var RenderState = function () {
  function RenderState(task) {
    classCallCheck(this, RenderState);

    this.maxActiveTextureCount = task.maxActiveTextureCount;
    this.gl = task.gl;
    this.task = task;
    this.__stateStack = [];
    this.glState = {
      bindingFBO: null,
      bindingTexture: null
    };
  }

  createClass(RenderState, [{
    key: 'saveGLState',
    value: function saveGLState() {}
  }, {
    key: 'defaultGLState',
    value: function defaultGLState() {
      var gl = this.gl;
      STATE_VARS.forEach(function (cap) {
        return gl.disable(gl[cap]);
      });
      gl.depthMask(false);
    }
  }, {
    key: 'restoreGLState',
    value: function restoreGLState() {
      var gl = this.gl;
      STATE_VARS.forEach(function (cap) {
        return gl.enable(gl[cap]);
      });
      gl.depthMask(true);
    }
  }, {
    key: 'applyUniformValue',
    value: function applyUniformValue(name, value) {
      var uniformInfo = this.program.uniformInfoMap[name];
      if (!uniformInfo) {
        console.warn('unable to set uniform value:' + name);
      } else {
        var type = uniformInfo.type;
        var gl = this.gl;
        var loc = uniformInfo.loc;
        if (type === FLOAT) {
          gl.uniform1f(loc, +value);
        } else if (type === SAMPLER_CUBE || type === SAMPLER_2D || type === INT) {
          gl.uniform1i(loc, parseInt(value));
        } else if (type === BOOL) {
          gl.uniform1i(loc, value ? 1 : 0);
        } else if (type === FLOAT_VEC2) {
          gl.uniform2fv(loc, value);
        } else if (type === FLOAT_VEC3) {
          gl.uniform3fv(loc, value);
        } else if (type === FLOAT_VEC4) {
          gl.uniform4fv(loc, value);
        } else if (type === FLOAT_MAT2) {
          gl.uniformMatrix2fv(loc, false, value);
        } else if (type === FLOAT_MAT3) {
          gl.uniformMatrix3fv(loc, false, value);
        } else if (type === FLOAT_MAT4) {
          gl.uniformMatrix4fv(loc, false, value);
        } else {
          console.warn('type ' + type + ' is not supported');
        }
      }
    }
  }]);
  return RenderState;
}();

/**
 * Created by brian on 17/07/2017.
 */
var Renderer = function () {
  function Renderer(arg) {
    classCallCheck(this, Renderer);

    arg = arg || {};
    this.name = arg.name || randomName(this.constructor.name);
    this.initialize(arg);
  }

  createClass(Renderer, [{
    key: 'initialize',
    value: function initialize(arg) {}
  }, {
    key: 'update',
    value: function update(gl, state) {}
  }, {
    key: 'render',
    value: function render(gl, state) {}
  }, {
    key: 'dispose',
    value: function dispose(gl) {}
  }, {
    key: 'invalid',
    value: function invalid() {
      if (this.parent) {
        this.parent.invalid();
      }
    }
  }, {
    key: 'disabled',
    get: function get$$1() {
      return this.__disabled;
    },
    set: function set$$1(v) {
      if (v != this.disabled) {
        this.__disabled = !!v;
        this.invalid();
      }
    }
  }]);
  return Renderer;
}();
var seed$1 = 1;
function randomName(prefix) {
  return prefix + ':' + seed$1++;
}

/**
 * Created by brian on 8/21/16.
 */
function arrAdd(array, item) {
  if (array.indexOf(item) === -1) {
    array.push(item);
    return true;
  }
  return false;
}

function arrRemove(array, item) {
  var i = array.indexOf(item);
  if (i >= 0) {
    array.splice(i, 1);
    return true;
  }
  return false;
}

var GLRenderNode = function (_Renderer) {
  inherits(GLRenderNode, _Renderer);

  function GLRenderNode() {
    classCallCheck(this, GLRenderNode);
    return possibleConstructorReturn(this, (GLRenderNode.__proto__ || Object.getPrototypeOf(GLRenderNode)).apply(this, arguments));
  }

  createClass(GLRenderNode, [{
    key: 'initialize',
    value: function initialize(arg) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'initialize', this).call(this, arg);
      this.children = [];
      this.__childrenCacheMap = {};
      this.__uniformMap = {};
      this.__renderMiddlewareFuncs = [];
      this.__updateMiddlewareFuncs = [];
      this.__removedChildren = [];
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'update', this).call(this, gl, state);
      this.__updateMiddlewareFuncs = this.__useMiddlewares(this.__updateMiddlewareFuncs, gl, state);
      this.__iterateChildren(gl, state, 'update');
      this.__removedChildren.forEach(function (c) {
        return c.dispose(gl);
      });
      this.__removedChildren = [];
    }
  }, {
    key: 'addChild',
    value: function addChild(child) {
      if (child instanceof Renderer && !child.parent && arrAdd(this.children, child)) {
        this.__childrenCacheMap[child.name] = null;
        child.parent = this;
        this.invalid();
        return true;
      }
      return false;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child, reuse) {
      var index = this.children.indexOf(child);
      if (index > -1) {
        this.children[index] = null;
        this.__childrenCacheMap[child.name] = null;
        child.parent = null;
        this.invalid();
        if (!reuse) {
          arrAdd(this.__removedChildren, child);
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'findChildByName',
    value: function findChildByName(name, recursive) {
      var children = this.children;
      var cache = this.__childrenCacheMap;
      var cached = cache[name];
      if (cached) {
        return cached;
      }
      for (var i = 0; i < children.length; i++) {
        var obj = children[i];
        if (obj && obj.name === name) {
          this.__childrenCacheMap[name] = obj;
          return obj;
        }
      }
      if (recursive) {
        for (var _i = 0; _i < children.length; _i++) {
          var _obj = children[_i];
          if (_obj instanceof GLRenderNode) {
            var find = _obj.findChildByName(name, recursive);
            if (find) {
              return find;
            }
          }
        }
      }
    }
  }, {
    key: '__iterateChildren',
    value: function __iterateChildren(gl, state, phrase) {
      var nextChildren = [];
      for (var i = 0, children = this.children; i < children.length; i++) {
        var child = children[i];
        if (child) {
          if (!child.disabled) {
            child[phrase](gl, state);
          }
          if (children.indexOf(child) > -1) {
            nextChildren.push(child);
          }
        }
      }

      this.children = nextChildren;
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'render', this).call(this, gl, state);
      forEach(this.__uniformMap, function (val, key) {
        return state.applyUniformValue(key, val);
      });
      this.__renderMiddlewareFuncs = this.__useMiddlewares(this.__renderMiddlewareFuncs, gl, state);
      this.__iterateChildren(gl, state, 'render');
      return true;
    }
  }, {
    key: 'dispose',
    value: function dispose(gl) {
      get(GLRenderNode.prototype.__proto__ || Object.getPrototypeOf(GLRenderNode.prototype), 'dispose', this).call(this, gl);
      this.__childrenCacheMap = {};
      this.__renderMiddlewareFuncs = [];
      this.__uniformMap = {};
      this.__updateMiddlewareFuncs = [];
      this.children.forEach(function (c) {
        return c && c.dispose(gl);
      });
    }
  }, {
    key: '__useMiddlewares',
    value: function __useMiddlewares(middlewares, gl, state) {
      var self = this;
      return middlewares.filter(function (func, i) {
        if (func) {
          func.call(self, gl, state);
          return middlewares[i] === func;
        }
        return false;
      });
    }
  }, {
    key: '__addMiddleware',
    value: function __addMiddleware(func, phrase) {
      var _this2 = this;

      var funcs = void 0;
      if (isFunc(func)) {
        if (phrase == 'render') {
          funcs = '__renderMiddlewareFuncs';
        } else if (phrase == 'update') {
          funcs = '__updateMiddlewareFuncs';
        }
        if (funcs) {
          arrAdd(this[funcs], func);
          return function () {
            var index = _this2[funcs].indexOf(func);
            if (index > -1) {
              _this2[funcs][index] = 0;
            }
          };
        }
      }
      return function () {
        return void 0;
      };
    }
  }, {
    key: 'addUpdateMiddleware',
    value: function addUpdateMiddleware(func) {
      return this.__addMiddleware(func, 'update');
    }
  }, {
    key: 'addRenderMiddleware',
    value: function addRenderMiddleware(func) {
      return this.__addMiddleware(func, 'render');
    }
  }, {
    key: 'setUniformValue',
    value: function setUniformValue(name, value) {
      if (value instanceof Array) {
        value = new Float32Array(value);
      }
      if (value == undefined) {
        delete this.__uniformMap[name];
      } else {
        this.__uniformMap[name] = value;
      }
      this.invalid();
      return this;
    }
  }]);
  return GLRenderNode;
}(Renderer);

/**
 * Created by brian on 19/07/2017.
 */
function addEventListener(obj, evtName, handler, once) {
  if (typeof evtName == "string" && evtName && isFunc(handler)) {
    var cbs = void 0,
        hs = void 0;
    if (!obj.hasOwnProperty('$$callbacks')) {
      obj.$$callbacks = {};
    }
    cbs = obj.$$callbacks;
    if (!(hs = cbs[evtName])) {
      hs = cbs[evtName] = [];
    }
    return arrAdd(hs, once ? warpOnceFunc(handler) : handler);
  }
  return false;
}
function emitEvent(obj, evtName) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var callbacks = void 0,
      handlers = void 0;
  if (!obj.hasOwnProperty('$$callbacks') || !(handlers = (callbacks = obj.$$callbacks)[evtName])) {
    return false;
  }
  return callbacks[evtName] = handlers.reduce(function (next, call) {
    if (isFunc(call) && call.apply(obj, args) !== -1) {
      next.push(call);
    }
    return next;
  }, []);
}
function removeEventListener(obj, evtName, handler) {
  var cbs = void 0,
      hs = void 0;
  if ((cbs = obj.$$callbacks) && (hs = cbs[evtName]) && hs) {
    arrRemove(hs, handler);
  }
  return obj;
}

function wrapConstructorAsEventTarget(func) {
  var proto = isFunc(func) ? func.prototype : func;
  if (proto) {
    proto.removeEventListener = _removeEventListener;
    proto.addEventListener = _addEventListener;
  }
}
function _removeEventListener(name, func) {
  removeEventListener(this, name, func);
}

function _addEventListener(name, func) {
  addEventListener(this, name, func);
}
function warpOnceFunc(func) {
  return function () {
    func.apply(this, arguments);
    return -1;
  };
}

/**
 * Created by brian on 17/07/2017.
 */
var GLTask = function () {
  createClass(GLTask, [{
    key: 'looping',
    get: function get$$1() {
      return this.__frameId > 0;
    }
  }]);

  function GLTask() {
    classCallCheck(this, GLTask);

    this.rootNode = new GLRenderNode({ name: 'root' });
    this.rootNode.parent = this;
    this.__needRepaint = true;
    this.__frameId = 0;
    if (arguments.length == 1 && arguments[0]) {
      this.initialize(arguments[0]);
    }
  }

  createClass(GLTask, [{
    key: 'initialize',
    value: function initialize(arg) {
      if (arg.gl instanceof WebGLRenderingContext) {
        this.gl = arg.gl;
      } else if (arg.canvas instanceof HTMLCanvasElement) {
        if (!(this.gl = arg.canvas.getContext('webgl', arg.glOptions || {}))) {
          throw Error('get WebGL Context failed');
        }
      }
      var gl = this.gl;
      this.maxActiveTextureCount = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

      return this;
    }
  }, {
    key: 'watchDocument',
    value: function watchDocument() {
      var _this = this;

      this.unwatchDocument();
      document.addEventListener('pause', this.__pauseHandler = function () {
        _this.__paused = true;
        emitEvent(_this, EVT_RENDER_PAUSE, { target: _this });
      }, true);
      document.addEventListener('resume', this.__resumeHandler = function () {
        _this.__paused = false;
        emitEvent(_this, EVT_RENDER_RESUME, { target: _this });
      }, true);
      return this;
    }
  }, {
    key: 'unwatchDocument',
    value: function unwatchDocument() {
      document.removeEventListener('pause', this.__pauseHandler, true);
      document.removeEventListener('resume', this.__resumeHandler, true);
    }
  }, {
    key: 'loop',
    value: function loop() {
      if (this.__frameId <= 0) {
        var self = this;
        this.__frameId = requestAnimationFrame(function loop() {
          self.render();
          if (self.__frameId !== -1) {
            self.__frameId = requestAnimationFrame(loop);
          }
        });
      }
      return this;
    }
  }, {
    key: 'stop',
    value: function stop() {
      cancelAnimationFrame(this.__frameId);
      this.__frameId = -1;
      return this;
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.__paused) {
        var gl = this.gl;
        var state = new RenderState(this);
        this.last = this.now;
        this.now = Date.now();
        this.timeDelta = this.now - this.last || 0;
        if (!this.rootNode.disabled) {
          this.rootNode.update(gl, state);
        }
        if (!this.rootNode.disabled && this.__needRepaint) {
          state.saveGLState();
          state.defaultGLState();
          emitEvent(this, EVT_BEFORE_RENDER, state);
          this.rootNode.render(gl, state);
          emitEvent(this, EVT_AFTER_RENDER, state);
          state.restoreGLState();
        }
        this.__needRepaint = false;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.stop();
      this.unwatchDocument();
      if (this.gl) {
        this.rootNode.dispose(this.gl);
      }
    }
  }, {
    key: 'invalid',
    value: function invalid() {
      this.__needRepaint = true;
    }
  }]);
  return GLTask;
}();

wrapConstructorAsEventTarget(GLTask);

/**
 * Created by brian on 17/07/2017.
 */
var GLMesh = function (_GLRenderNode) {
  inherits(GLMesh, _GLRenderNode);

  function GLMesh() {
    classCallCheck(this, GLMesh);
    return possibleConstructorReturn(this, (GLMesh.__proto__ || Object.getPrototypeOf(GLMesh)).apply(this, arguments));
  }

  createClass(GLMesh, [{
    key: 'initialize',
    value: function initialize(arg) {
      get(GLMesh.prototype.__proto__ || Object.getPrototypeOf(GLMesh.prototype), 'initialize', this).call(this, arg);
      this.primitive = arg.primitive || WebGL_CONST.POINTS;
      this.startIndex = arg.startIndex || 0;
      this.drawCount = arg.drawCount;
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      get(GLMesh.prototype.__proto__ || Object.getPrototypeOf(GLMesh.prototype), 'render', this).call(this, gl, state);
      var viewport = void 0,
          drawingViewport = void 0;
      if (drawingViewport = this.drawingViewport) {
        viewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport(drawingViewport[0], drawingViewport[1], drawingViewport[2], drawingViewport[3]);
      }
      this.beforeDraw(gl, state);
      this.draw(gl, state);
      this.afterDraw(gl, state);
      if (viewport) {
        gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
      }
      return true;
    }
  }, {
    key: 'beforeDraw',
    value: function beforeDraw(gl, state) {}
  }, {
    key: 'draw',
    value: function draw(gl, state) {
      gl.drawArrays(this.primitive, this.startIndex, this.drawCount);
    }
  }, {
    key: 'afterDraw',
    value: function afterDraw(gl, state) {}
  }]);
  return GLMesh;
}(GLRenderNode);

/**
 * Created by brian on 17/10/2016.
 */
function dictionarySet(target, key, value) {
  var arr = target[key];
  if (!arr) {
    target[key] = [value];
  } else if (arr.indexOf(value) === -1) {
    arr.push(value);
  } else {
    return false;
  }
  return true;
}

/**
 * Created by brian on 17/07/2017.
 */
var GLProgram = function (_GLRenderNode) {
  inherits(GLProgram, _GLRenderNode);

  function GLProgram() {
    classCallCheck(this, GLProgram);
    return possibleConstructorReturn(this, (GLProgram.__proto__ || Object.getPrototypeOf(GLProgram)).apply(this, arguments));
  }

  createClass(GLProgram, [{
    key: 'initialize',
    value: function initialize(arg) {
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'initialize', this).call(this, arg);
      this.uniformInfoMap = {};
      this.attributeInfoMap = {};
      this.samplerNames = [];
      this.fragmentShader = arg.fragmentShader;
      this.vertexShader = arg.vertexShader;
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'update', this).call(this, gl, state);
      if (!this.__glHandle) {
        this.setup(gl);
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      state.program = this;
      gl.useProgram(this.__glHandle);
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'render', this).call(this, gl, state);
    }
  }, {
    key: 'activeTextureIndexForName',
    value: function activeTextureIndexForName(name) {
      return this.samplerNames.indexOf(name);
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      var program = createGLProgram(gl, this.vertexShader, this.fragmentShader, this.define);
      this.__glHandle = program;
      var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < uniformCount; i++) {
        var info = gl.getActiveUniform(program, i);
        info.loc = gl.getUniformLocation(program, info.name);
        this.uniformInfoMap[info.name] = info;
        var _type = info.type;
        if (_type === WebGL_CONST.SAMPLER_2D || _type === WebGL_CONST.SAMPLER_CUBE) {
          this.samplerNames.push(info.name);
        }
      }
      var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (var _i = 0; _i < attributeCount; _i++) {
        var _info = gl.getActiveAttrib(program, _i);
        _info.loc = gl.getAttribLocation(program, _info.name);
        var index = TYPE_SIZES.indexOf(_info.type);
        if (index == -1) {
          throw Error('un supported type:' + _info.type);
        }
        _info.vecSize = TYPE_SIZES[index + 1];
        this.attributeInfoMap[_info.name] = _info;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose(gl) {
      get(GLProgram.prototype.__proto__ || Object.getPrototypeOf(GLProgram.prototype), 'dispose', this).call(this, gl);
      if (this.__glHandle) {
        gl.deleteProgram(this.__glHandle);
        this.__glHandle = null;
      }
    }
  }]);
  return GLProgram;
}(GLRenderNode);
var TYPE_SIZES = [WebGL_CONST.FLOAT, 1, WebGL_CONST.FLOAT_VEC2, 2, WebGL_CONST.FLOAT_VEC3, 3, WebGL_CONST.FLOAT_VEC4, 4];
function createGLProgram(gl, vSource, fSource, define) {
  var program = gl.createProgram(),
      shader = gl.createShader(gl.FRAGMENT_SHADER),
      marco = '',
      error = void 0;
  forEach(define, function (val, key) {
    marco += '#define ' + key + ' ' + val + '\n';
  });
  gl.shaderSource(shader, marco + fSource);
  gl.compileShader(shader);
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    error = gl.getShaderInfoLog(shader);
    throw Error('fragment shader fail:\n' + prettyPrintError(error, marco + fSource));
  }
  gl.attachShader(program, shader);
  gl.deleteShader(shader);
  shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shader, marco + vSource);
  gl.compileShader(shader);
  compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    error = gl.getShaderInfoLog(shader);
    throw Error('vertex shader fail:\n' + prettyPrintError(error, marco + vSource));
  }
  gl.attachShader(program, shader);
  gl.linkProgram(program);
  gl.deleteShader(shader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    error = gl.getProgramInfoLog(program);
    throw Error('program link fail:' + error);
  }
  return program;
}
function prettyPrintError(message, source) {
  var exp = /\d+:(\d+):(.*?)(\n|$)/g;
  var match = void 0;
  var dictionary = {};
  while (match = exp.exec(message)) {
    var line = match[1];
    var reason = match[2];
    dictionarySet(dictionary, line, '*** ERROR:' + reason + ' ***');
  }
  var lines = source.split('\n');
  var errorLines = [];
  forEach(dictionary, function (reasons, line) {
    var index = line - 1;
    errorLines.push(lines[index] + '\nline:' + index + ':' + reasons.join('\n') + '\n');
  });
  return errorLines.join('\n');
}

/**
 * Created by brian on 17/07/2017.
 */
var GLAttribute = function (_Renderer) {
  inherits(GLAttribute, _Renderer);

  function GLAttribute() {
    classCallCheck(this, GLAttribute);
    return possibleConstructorReturn(this, (GLAttribute.__proto__ || Object.getPrototypeOf(GLAttribute)).apply(this, arguments));
  }

  createClass(GLAttribute, [{
    key: 'initialize',
    value: function initialize(arg) {
      this.stride = arg.stride || 0;
      this.offset = arg.offset || 0;
      this.data = arg.data;
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      var info = state.program.attributeInfoMap[this.name];
      if (!info) {
        console.error('no attribute named ' + this.name + ' found');
      } else {
        if (!this.__glHandle) {
          this.setup(gl);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.__glHandle);
        if (this.__dataInvalid) {
          this.bufferData(gl);
          this.__dataInvalid = false;
          this.__data = null;
        }
        gl.enableVertexAttribArray(info.loc);
        gl.vertexAttribPointer(info.loc, info.vecSize, gl.FLOAT, false, this.stride, this.offset);
      }
    }
  }, {
    key: 'bufferData',
    value: function bufferData(gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.__glHandle);
      gl.bufferData(gl.ARRAY_BUFFER, this.__data, gl.STATIC_DRAW);
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      this.__glHandle = gl.createBuffer();
    }
  }, {
    key: 'convertValidData',
    value: function convertValidData(data) {
      var fa = data;
      if (data instanceof Array || data instanceof ArrayBuffer) {
        fa = new Float32Array(data);
      }
      if (!(fa instanceof Float32Array)) {
        throw Error('Float32Array expected');
      }
      return fa;
    }
  }, {
    key: 'dispose',
    value: function dispose(gl) {
      if (this.__glHandle) {
        gl.deleteBuffer(this.__glHandle);
        this.__glHandle = null;
      }
    }
  }, {
    key: 'data',
    set: function set$$1(v) {
      this.__data = this.convertValidData(v);
      this.__dataInvalid = true;
      this.invalid();
    }
  }]);
  return GLAttribute;
}(Renderer);

/**
 * Created by brian on 17/07/2017.
 */
var GLTexture = function (_Renderer) {
  inherits(GLTexture, _Renderer);

  function GLTexture() {
    classCallCheck(this, GLTexture);
    return possibleConstructorReturn(this, (GLTexture.__proto__ || Object.getPrototypeOf(GLTexture)).apply(this, arguments));
  }

  createClass(GLTexture, [{
    key: 'initialize',
    value: function initialize(arg) {
      this.type = arg.type === WebGL_CONST.TEXTURE_CUBE_MAP ? WebGL_CONST.TEXTURE_CUBE_MAP : WebGL_CONST.TEXTURE_2D;
      this.dataFormat = arg.dataFormat || WebGL_CONST.UNSIGNED_BYTE;
      this.data = arg.data;
      this.size = [0, 0];
      this.flipY = arg.flipY === undefined ? true : arg.flipY;
      this.isDynamic = arg.isDynamic;
      this.params = {
        TEXTURE_MAG_FILTER: arg.magFilter || WebGL_CONST.NEAREST,
        TEXTURE_MIN_FILTER: arg.minFilter || WebGL_CONST.NEAREST,
        TEXTURE_WRAP_S: arg.wrapS || WebGL_CONST.CLAMP_TO_EDGE,
        TEXTURE_WRAP_T: arg.wrapT || WebGL_CONST.CLAMP_TO_EDGE
      };
      this.format = arg.format || WebGL_CONST.RGBA;
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      if (this.isDynamic) {
        this.invalid();
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      this.setup(gl);
      gl.bindTexture(this.type, this.__glHandle);
      state.glState.bindingTexture = this;
      this.bufferData(gl);
    }
  }, {
    key: 'bufferData',
    value: function bufferData(gl) {
      if (this.__dataInvalid || this.isDynamic) {
        this.__bufferData(gl);
        this.__dataInvalid = false;
      }
    }
  }, {
    key: '__bufferData',
    value: function __bufferData(gl) {
      var data = this.__data;
      if (data) {
        gl.bindTexture(this.type, this.__glHandle);
        var _format = this.format;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
        if (isImageLike(data) || isCanvasLike(data) || isVideo(data)) {
          gl.texImage2D(gl.TEXTURE_2D, 0, _format, _format, this.dataFormat, data);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, _format, data.width, data.height, 0, _format, this.dataFormat, data.data);
        }
        this.useTexParam(gl, this.params);
        if (!this.isDynamic) {
          this.__data = null;
        }
      }
    }
  }, {
    key: 'useTexParam',
    value: function useTexParam(gl, params) {
      var targetTexture = this.type;
      var dataFormat = this.dataFormat;
      var method = dataFormat === WebGL_CONST.UNSIGNED_BYTE ? 'texParameteri' : 'texParameterf';
      forEach(params, function (val, key) {
        gl[method](targetTexture, gl[key], val);
      });
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      if (!this.__glHandle) {
        var texture = gl.createTexture();
        var dataFormat = this.dataFormat;
        if (dataFormat === WebGL_CONST.FLOAT && !gl.getExtension('OES_texture_float')) {
          throw Error('float texture is not support');
        } else if (dataFormat === WebGL_CONST.HALF_FLOAT_OES && !gl.getExtension('OES_texture_half_float')) {
          throw Error('half float texture is not support');
        }
        this.__glHandle = texture;
      }
      return this;
    }
  }, {
    key: 'checkValidData',
    value: function checkValidData(source) {
      var width = 0,
          height = 0,
          format = void 0;
      var isDynamic = false;
      if (isImageLike(source)) {
        if (!source.complete) {
          throw Error('image as data should be loaded');
        }
        width = source.naturalWidth;
        height = source.naturalHeight;
        format = WebGL_CONST.RGBA;
      } else if (isVideo(source)) {
        width = source.videoWidth;
        height = source.videoHeight;
        format = WebGL_CONST.RGB;
        isDynamic = true;
      } else if (isCanvasLike(source) || isObjectSource(source)) {
        width = source.width;
        height = source.height;
        format = source.format || this.format;
      } else if (source != null) {
        throw Error('invalid texture source');
      }
      this.isDynamic = isDynamic;
      return { width: width, height: height, format: format };
    }
  }, {
    key: 'dispose',
    value: function dispose(gl) {
      if (this.__glHandle) {
        gl.deleteTexture(this.__glHandle);
        this.__glHandle = null;
        this.__data = null;
      }
    }
  }, {
    key: 'data',
    set: function set$$1(source) {
      var info = this.checkValidData(source);
      this.size = [info.width, info.height];
      this.format = info.format;
      this.__data = source;
      this.__dataInvalid = true;
      this.invalid();
    }
  }]);
  return GLTexture;
}(Renderer);

/*export function isSampler2DSource(obj){
 return isImageLike(obj) || isCanvasLike(obj) || obj instanceof HTMLVideoElement || isObjectSource(obj)
 }*/
function isObjectSource(source) {
  return isObj(source) && isObj(source.data) && +source.width && +source.height && source.data.buffer instanceof ArrayBuffer;
}

function isImageLike(source) {
  return source instanceof HTMLImageElement || source instanceof Image;
}

function isCanvasLike(source) {
  return source instanceof HTMLCanvasElement || source instanceof ImageData;
}

function isVideo(source) {
  return source instanceof HTMLVideoElement;
}

/*function setTextureParam(gl, method, target, key, value){
 if (value) {
 gl[method](target, gl[key], value);
 }
 }
 function setTextureFilter(gl, method, target, dataFormat, key, val){
 if (val === WebGL_CONST.LINEAR) {
 let extension;
 if (dataFormat === WebGL_CONST.HALF_FLOAT_OES) {
 extension = 'OES_texture_half_float_linear';
 }
 else if (dataFormat === WebGL_CONST.FLOAT) {
 extension = 'OES_texture_float_linear';
 }
 if (!gl.getExtension(extension)) {
 console.warn(`${extension} is not supported`);
 }
 }
 setTextureParam(gl, method, target, key, val);
 }*/

/**
 * Created by brian on 17/07/2017.
 */
var GLSampler2D = function (_GLTexture) {
  inherits(GLSampler2D, _GLTexture);

  function GLSampler2D() {
    classCallCheck(this, GLSampler2D);
    return possibleConstructorReturn(this, (GLSampler2D.__proto__ || Object.getPrototypeOf(GLSampler2D)).apply(this, arguments));
  }

  createClass(GLSampler2D, [{
    key: 'render',
    value: function render(gl, state) {
      renderSampler2D(gl, state, this);
    }
  }]);
  return GLSampler2D;
}(GLTexture);

function renderSampler2D(gl, state, texture, name) {
  name = name || texture.name;
  var index = state.program.activeTextureIndexForName(name);
  if (index !== -1) {
    gl.activeTexture(gl.TEXTURE0 + index);
    GLTexture.prototype.render.call(texture, gl, state);
    state.applyUniformValue(name, index);
  } else {
    console.warn('sampler ' + name + ' not found');
  }
}

/**
 * Created by brian on 24/07/2017.
 */
var GLFrameBuffer = function (_Renderer) {
  inherits(GLFrameBuffer, _Renderer);

  function GLFrameBuffer() {
    classCallCheck(this, GLFrameBuffer);
    return possibleConstructorReturn(this, (GLFrameBuffer.__proto__ || Object.getPrototypeOf(GLFrameBuffer)).apply(this, arguments));
  }

  createClass(GLFrameBuffer, [{
    key: 'initialize',
    value: function initialize(arg) {
      this.__texture = new GLTexture(arg.texture || { name: 'fbo-target' });
      this._w = arg.width || 0;
      this._h = arg.height || 0;
      this.shouldClearTexture = true;
      this.shouldCheckComplete = true;
    }
  }, {
    key: 'update',
    value: function update(gl, state) {
      this.__texture.update(gl, state);
    }
  }, {
    key: 'unbind',
    value: function unbind(gl, state) {
      var binding = state.glState.bindingFBO;
      if (binding === this) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else if (binding) {
        throw Error('the framebuffer to unbind is not binding');
      }
    }
  }, {
    key: 'setup',
    value: function setup(gl) {
      if (!this.__glHandle) {
        this.__glHandle = gl.createFramebuffer();
        var texture = this.__texture;
        texture.setup(gl);
        gl.bindTexture(gl.TEXTURE_2D, texture.__glHandle);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.__glHandle);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.__glHandle, 0);
        return true;
      }
    }
  }, {
    key: 'render',
    value: function render(gl, state) {
      var w = this._w || gl.drawingBufferWidth;
      var h = this._h || gl.drawingBufferHeight;
      var texture = this.__texture;
      var bindingTex = state.glState.bindingTexture;
      this.setup(gl);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.__glHandle);
      state.glState.bindingFBO = this;
      texture.useTexParam(gl, texture.params);
      texture.size = [w, h];
      var dataFormat = texture.dataFormat;
      if (this.shouldClearTexture) {
        var format = gl.RGBA;
        gl.texImage2D(gl.TEXTURE_2D, 0, format, w, h, 0, format, dataFormat, null);
        this.shouldClearTexture = false;
      }
      if (this.shouldCheckComplete) {
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
          var moreReason = '';
          if (dataFormat === gl.FLOAT || dataFormat === WebGL_CONST.HALF_FLOAT_OES) {
            moreReason = ' Not support render to ' + (dataFormat === WebGL_CONST.HALF_FLOAT_OES ? 'half ' : '') + ' float texture';
          }
          throw Error('FrameBuffer failed' + moreReason);
        } else {
          this.shouldCheckComplete = false;
        }
      }
      if (bindingTex) {
        bindingTex.render(gl, state);
      }
    }
  }, {
    key: 'createSampler2DMiddleware',
    value: function createSampler2DMiddleware(name, keepBinding) {
      var _this2 = this;

      return function (gl, state) {
        renderSampler2D(gl, state, _this2.__texture, name);
        if (!keepBinding) {
          _this2.unbind(gl, state);
        }
      };
    }
  }, {
    key: 'dispose',
    value: function dispose(gl) {
      if (this.__glHandle) {
        gl.deleteFramebuffer(this.__glHandle);
        this.__texture.dispose(gl);
      }
    }
  }, {
    key: 'size',
    set: function set$$1(s) {
      this.width = s[0];
      this.height = s[1];
    },
    get: function get$$1() {
      return [this._w, this._h];
    }
  }, {
    key: 'width',
    get: function get$$1() {
      return this._w;
    },
    set: function set$$1(v) {
      v = parseInt(v);
      if (this._w !== v) {
        this._w = v;
        this.invalid();
      }
    }
  }, {
    key: 'height',
    get: function get$$1() {
      return this._h;
    },
    set: function set$$1(v) {
      v = parseInt(v);
      if (this._h !== v) {
        this._h = v;
        this.invalid();
      }
    }
  }]);
  return GLFrameBuffer;
}(Renderer);

/**
 * Created by brian on 14/10/2016.
 */
function createMat3(elements) {
  if (!elements) {
    elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }
  if (elements.length !== 9) {
    throw Error('9 elements expected');
  }
  var mat = new Float32Array(elements);
  forEach(mat3Proto, function (v, k) {
    return mat[k] = v;
  });
  return mat;
}
var mat3Proto = {
  translate: function translate(x, y) {
    return concatMat3(this, [1, 0, 0, 0, 1, 0, x || 0, y || 0, 1]);
  },
  scale: function scale(x, y) {
    return concatMat3(this, [defaultIfNaN(x, 1), 0, 0, 0, defaultIfNaN(y, 1), 0, 0, 0, 1]);
  },
  rotate: function rotate(rotation) {
    var sina = sin(rotation),
        cosa = cos(rotation);
    return concatMat3(this, [cosa, sina, 0, -sina, cosa, 0, 0, 0, 1]);
  },
  concat: function concat(mat) {
    return concatMat3(this, mat);
  },
  toString: function toString() {
    var ret = [];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        ret.push(this[j + i * 3].toFixed(2));
      }ret.push('\n');
    }
    return ret.join(' ');
  }
};

function vec3transformMat3(x, y, z, m) {
  var out = new Float32Array(3);
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function concatMat3(mat, other) {
  var a = other,
      b = mat,
      out = b;
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      b00 = b[0],
      b01 = b[1],
      b02 = b[2],
      b10 = b[3],
      b11 = b[4],
      b12 = b[5],
      b20 = b[6],
      b21 = b[7],
      b22 = b[8];

  out[0] = a00 * b00 + a01 * b10 + a02 * b20;
  out[1] = a00 * b01 + a01 * b11 + a02 * b21;
  out[2] = a00 * b02 + a01 * b12 + a02 * b22;

  out[3] = a10 * b00 + a11 * b10 + a12 * b20;
  out[4] = a10 * b01 + a11 * b11 + a12 * b21;
  out[5] = a10 * b02 + a11 * b12 + a12 * b22;

  out[6] = a20 * b00 + a21 * b10 + a22 * b20;
  out[7] = a20 * b01 + a21 * b11 + a22 * b21;
  out[8] = a20 * b02 + a21 * b12 + a22 * b22;
  return out;
}

var sin = Math.sin;
var cos = Math.cos;

function defaultIfNaN(v, def) {
  var ret = +v;
  return isNaN(ret) ? def : ret;
}

/**
 * Created by brian on 27/07/2017.
 */
function sizeEquals(s0, s1) {
  return s0 && s1 && s0[0] == s1[0] && s0[1] == s1[1];
}
function sizeValid(s) {
  return s && !isNaN(s[0]) && !isNaN(s[1]);
}

/**
 * Created by brian on 18/07/2017.
 */
var VARYING_TEX_COORD = 'vTexCoord';
var UNIFORM_TEX_SIZE = 'uTexSize';
var UNIFORM_TEX_SOURCE = 'uSampler';

var GLFilter = function (_GLProgram) {
  inherits(GLFilter, _GLProgram);

  function GLFilter() {
    classCallCheck(this, GLFilter);
    return possibleConstructorReturn(this, (GLFilter.__proto__ || Object.getPrototypeOf(GLFilter)).apply(this, arguments));
  }

  createClass(GLFilter, [{
    key: 'initialize',
    value: function initialize(arg) {
      var _this2 = this;

      if (arg.program) {
        arg.fragmentShader = fragShaderFromProgram(arg.program);
      }
      if (!arg.vertexShader) {
        arg.vertexShader = VERTEX_SHADER;
      }
      if (!arg.fragmentShader) {
        arg.fragmentShader = COPY_FRAG_SHADER;
      }
      get(GLFilter.prototype.__proto__ || Object.getPrototypeOf(GLFilter.prototype), 'initialize', this).call(this, arg);
      this.__useTexSize = this.fragmentShader.indexOf(UNIFORM_TEX_SIZE) > -1 || this.vertexShader.indexOf(UNIFORM_TEX_SIZE) > -1;
      this.setupGLEntities(arg);
      this.createChildren().forEach(function (c) {
        return _this2.addChild(c);
      });
      this.targets = [];
      this.__targetsInfo = [];
      this.size = [0, 0];
    }
  }, {
    key: 'setupGLEntities',
    value: function setupGLEntities(arg) {
      this.addChild(new GLAttribute({ name: 'aQuad', data: [-1, -1, 1, -1, -1, 1, 1, 1] }));
      this.addChild(new GLAttribute({ name: 'aTexCoord', data: [0, 0, 1, 0, 0, 1, 1, 1] }));
      this.setupSamplers(arg);
    }
  }, {
    key: 'setupSamplers',
    value: function setupSamplers(arg) {
      this.addChild(new GLSampler2D({ name: this.sourceSamplerName }));
    }
  }, {
    key: 'transformTexCoord',
    value: function transformTexCoord(mat) {
      var aQuadData = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      var texData = new Float32Array(aQuadData.length);
      for (var i = 0; i < texData.length; i += 2) {
        var point = vec3transformMat3(aQuadData[i], aQuadData[i + 1], 1, mat);
        var x = point[0] / point[2];
        var y = point[1] / point[2];
        texData[i] = (x + 1) / 2;
        texData[i + 1] = (y + 1) / 2;
      }
      var aTexCoord = this.findChildByName('aTexCoord');
      aTexCoord.data = texData;
      this.invalid();
    }
  }, {
    key: 'createChildren',
    value: function createChildren() {
      return [new GLMesh({ drawCount: 4, primitive: WebGL_CONST.TRIANGLE_STRIP })];
    }
  }, {
    key: '__getSize',
    value: function __getSize() {
      return this.__size;
    }
  }, {
    key: 'onSizeChanged',
    value: function onSizeChanged(size) {
      if (this.__useTexSize) {
        this.setUniformValue(UNIFORM_TEX_SIZE, size);
      }
      this.targets.forEach(function (filter) {
        return filter.size = size;
      });
    }
  }, {
    key: 'setSamplerData',
    value: function setSamplerData(data) {
      var sampler = this.findChildByName(this.sourceSamplerName);
      sampler.data = data;
      this.size = sampler.size;
    }
  }, {
    key: '__getFBOParent',
    value: function __getFBOParent() {
      for (var children = this.children, i = children.length - 1; i >= 0; i--) {
        if (children[i] instanceof GLMesh) {
          return children[i];
        }
      }
    }
  }, {
    key: 'removeTargets',
    value: function removeTargets() {
      var _this3 = this;

      this.targets.slice().forEach(function (filter) {
        return _this3.removeTarget(filter);
      });
    }
  }, {
    key: 'pipeTargets',
    value: function pipeTargets(filters) {
      for (var current = this, i = 0; i < filters.length; i++) {
        var target = filters[i];
        current.addTarget(target);
        current = target;
      }
      return this;
    }
  }, {
    key: 'addTarget',
    value: function addTarget(filter, targetSamplerName) {
      if (!(filter instanceof GLFilter)) {
        throw Error('GLFilter expected');
      }
      if (this.targets.indexOf(filter) == -1) {
        var fbo = this.__fbo;
        if (!fbo) {
          fbo = this.__fbo = new GLFrameBuffer({ name: 'filter-fbo' });
          this.__getFBOParent().addChild(fbo);
        }
        var samplerName = targetSamplerName || filter.sourceSamplerName;
        filter.findChildByName(samplerName).disabled = true;
        var remove = filter.addRenderMiddleware(fbo.createSampler2DMiddleware(samplerName));
        this.addChild(filter);
        filter.size = this.size;
        this.targets.push(filter);
        this.__targetsInfo.push({ remove: remove, samplerName: samplerName });
      }
    }
  }, {
    key: 'removeTarget',
    value: function removeTarget(filter, reuse) {
      var targets = this.targets;
      var targetIndex = targets.indexOf(filter);
      if (targetIndex > -1 && this.removeChild(filter, reuse)) {
        var info = this.__targetsInfo[targetIndex];
        var sampler = filter.findChildByName(info.samplerName);
        sampler.disabled = false;
        filter.size = sampler.size;
        info.remove();
        arrRemove(targets, filter);
        arrRemove(this.__targetsInfo, info);
        if (!targets.length) {
          this.__getFBOParent().removeChild(this.__fbo);
          this.__fbo = null;
        }
      }
    }
  }, {
    key: 'size',
    get: function get$$1() {
      return this.__getSize();
    },
    set: function set$$1(size) {
      if (!sizeEquals(this.__size, size)) {
        if (!sizeValid(size)) {
          throw Error('invalid size:' + size);
        }
        this.onSizeChanged(this.__size = [size[0], size[1]]);
      }
    }
  }, {
    key: 'sourceSamplerName',
    get: function get$$1() {
      return UNIFORM_TEX_SOURCE;
    }
  }]);
  return GLFilter;
}(GLProgram);
GLFilter.primitive = WebGL_CONST.TRIANGLE_STRIP;
GLFilter.drawCount = 4;
var VERTEX_SHADER = '\nprecision mediump float;\n\nattribute vec2 aQuad;\nattribute vec2 aTexCoord;\n\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nvoid main(){\n   ' + VARYING_TEX_COORD + ' = aTexCoord;\n   gl_Position = vec4(aQuad,0.0,1.0);\n}\n';
var COPY_FRAG_SHADER = '\nprecision mediump float;\nuniform sampler2D ' + UNIFORM_TEX_SOURCE + ';\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nvoid main(){\n  gl_FragColor = texture2D(' + UNIFORM_TEX_SOURCE + ',' + VARYING_TEX_COORD + ');\n}\n';

var TAG_DECLARE = '#declare';

var TAG_MAIN = '#main';

function fragShaderFromProgram(program) {
  var declareIndex = program.indexOf(TAG_DECLARE);
  var mainIndex = program.indexOf(TAG_MAIN);
  var declaration = '',
      main = '';
  if (declareIndex == -1 && mainIndex == -1) {
    main = program;
  } else {
    declaration = program.substring(declareIndex + TAG_DECLARE.length, mainIndex);
    main = program.substring(mainIndex + TAG_MAIN.length);
  }

  return PROGRAM_TEMPLATE(declaration, main);
}
var PROGRAM_TEMPLATE = function PROGRAM_TEMPLATE(declare, main) {
  return '\nprecision mediump float;\nuniform sampler2D ' + UNIFORM_TEX_SOURCE + ';\nuniform vec2 ' + UNIFORM_TEX_SIZE + ';\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nstruct CommonData{\n  vec2 texCoord;\n  vec2 texSize;\n};\n\nvec4 mainImage(sampler2D source,CommonData data);\n\n' + declare + '\nvoid main(){\n  gl_FragColor = mainImage(' + UNIFORM_TEX_SOURCE + ',CommonData(' + VARYING_TEX_COORD + ',' + UNIFORM_TEX_SIZE + '));\n}\n' + main + '\n';
};

var _shaders;

/**
 * Created by brian on 07/08/2017.
 */
var CAMERA_FORMAT_YpCbCr = '420v';

var CAMERA_FORMAT_RGB = 'rgb';

var CAMERA_FORMAT_I420 = 'i420';

var CAMERA_FORMAT_MULTIPLE = 'multi';

var FORMAT_YV12 = 3;
var FORMAT_NV12 = 5;
var FORMAT_NV21 = 4;
var CameraSourceFilter = function (_GLFilter) {
  inherits(CameraSourceFilter, _GLFilter);

  function CameraSourceFilter() {
    classCallCheck(this, CameraSourceFilter);
    return possibleConstructorReturn(this, (CameraSourceFilter.__proto__ || Object.getPrototypeOf(CameraSourceFilter)).apply(this, arguments));
  }

  createClass(CameraSourceFilter, [{
    key: 'initialize',
    value: function initialize(arg) {
      var format = this.format = arg.format;
      if (!(arg.fragmentShader = shaders[format])) {
        throw Error('invalid camera format:' + format);
      }
      this.orientation = 0;
      get(CameraSourceFilter.prototype.__proto__ || Object.getPrototypeOf(CameraSourceFilter.prototype), 'initialize', this).call(this, arg);
    }
  }, {
    key: 'setupSamplers',
    value: function setupSamplers() {
      var _this2 = this;

      var flipY = false;
      var samplers = [];
      if (this.format === CAMERA_FORMAT_MULTIPLE) {
        // do it later
      } else if (this.format === CAMERA_FORMAT_YpCbCr) {
        samplers = [{ name: 'uYTex', format: WebGL_CONST.LUMINANCE, flipY: flipY }, { name: 'uCTex', format: WebGL_CONST.LUMINANCE_ALPHA, flipY: flipY }];
      } else if (this.format === CAMERA_FORMAT_RGB) {
        samplers = [{ name: this.sourceSamplerName, isDynamic: true, flipY: flipY }];
      } else if (this.format === CAMERA_FORMAT_I420) {
        samplers = ['uYTex', 'uUTex', 'uVTex'].map(function (name) {
          return {
            name: name,
            format: WebGL_CONST.LUMINANCE,
            flipY: flipY
          };
        });
      }
      this.samplers = samplers.map(function (cfg) {
        var sampler = new GLSampler2D(cfg);
        _this2.addChild(sampler);
        return sampler;
      });
    }
  }, {
    key: '_setupMultiFormatSampler',
    value: function _setupMultiFormatSampler(format) {
      var _this3 = this;

      var samplers = void 0;
      var flipY = false;
      if (format === FORMAT_NV21 || format === FORMAT_NV12) {
        this.fragmentShader = shaders[CAMERA_FORMAT_MULTIPLE];
        samplers = [{ name: 'uYTex', format: WebGL_CONST.LUMINANCE, flipY: flipY }, { name: 'uUVTex', format: WebGL_CONST.LUMINANCE_ALPHA, flipY: flipY }].map(function (opt) {
          return new GLSampler2D(opt);
        });
        this.setUniformValue('uFormat', format);
      } else {
        this.fragmentShader = shaders[CAMERA_FORMAT_I420];
        samplers = ['uYTex', 'uUTex', 'uVTex'].map(function (name) {
          return new GLSampler2D({
            name: name,
            format: WebGL_CONST.LUMINANCE,
            flipY: flipY
          });
        });
      }
      this.samplers = samplers;
      samplers.forEach(function (s) {
        return _this3.addChild(s);
      });
    }
  }, {
    key: 'setSourceVideo',
    value: function setSourceVideo(video) {
      if (this.format === CAMERA_FORMAT_RGB) {
        this.samplers[0].data = video;
        this.size = [video.videoWidth, video.videoHeight];
        this.invalid();
      }
    }

    // safari Array#forEach cause memory leak

  }, {
    key: 'setSamplerFrames',
    value: function setSamplerFrames(frames) {
      if (this.format === CAMERA_FORMAT_MULTIPLE) {
        if (!this.samplers.length) {
          this._setupMultiFormatSampler(frames[0].format || FORMAT_YV12);
        }
      }
      var frame0 = frames[0];
      var samplers = this.samplers;

      for (var i = 0; i < samplers.length; i++) {
        var sampler = samplers[i];
        sampler.data = createSource(frames[i]);
      }

      this.size = [frame0.width, frame0.height];
      this.__hasFrameData = true;
      this.invalid();
    }
  }, {
    key: 'bufferSamplerData',
    value: function bufferSamplerData(gl) {
      for (var i = 0, samplers = this.samplers; i < samplers.length; i++) {
        samplers[i].setup(gl).bufferData(gl);
      }
    }
  }, {
    key: '__getSize',
    value: function __getSize() {
      var size = this.__size;
      if (this.orientation == 270 || this.orientation == 90) {
        return [size[1], size[0]];
      }
      return size;
    }
  }, {
    key: 'hasFrameData',
    get: function get$$1() {
      return this.__hasFrameData;
    }
  }]);
  return CameraSourceFilter;
}(GLFilter);

function createSource(frameData) {
  var data = frameData.data;
  if (data instanceof ArrayBuffer) {
    data = new Uint8Array(data);
  }
  return { data: data, width: frameData.width, height: frameData.height };
}

var shaders = (_shaders = {}, defineProperty(_shaders, CAMERA_FORMAT_I420, '\nprecision mediump float;\n\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nuniform sampler2D uYTex;\nuniform sampler2D uUTex;\nuniform sampler2D uVTex;\n\nconst mat3 mYUV2RGB = mat3(1.,1.,1.,0.,-0.39173,2.017,1.5985,-0.8129,0.);\n\nvoid main(){\n  float y = 1.1643*(texture2D(uYTex,' + VARYING_TEX_COORD + ').r - 0.0625);\n  float u = texture2D(uUTex,' + VARYING_TEX_COORD + ').r - 0.5;\n  float v = texture2D(uVTex,' + VARYING_TEX_COORD + ').r - 0.5;\n  \n  gl_FragColor = vec4(mYUV2RGB * vec3(y,u,v),1.0);\n}\n'), defineProperty(_shaders, CAMERA_FORMAT_YpCbCr, '\nprecision mediump float;\n\nuniform sampler2D uYTex;\n\nuniform sampler2D uCTex;\n\nvarying vec2 ' + VARYING_TEX_COORD + ';\n\nconst mat3 transformYCrCbITURec601FullRangeToRGB = mat3(1.,1.,1.,0., -.18732, 1.8556,1.57481, -.46813,0.);\n\nvoid main(){\n  vec3 colourYCrCb;\n  colourYCrCb.x  = texture2D(uYTex, ' + VARYING_TEX_COORD + ').r;\n  colourYCrCb.yz = texture2D(uCTex, ' + VARYING_TEX_COORD + ').ra - 0.5;\n  gl_FragColor = vec4(transformYCrCbITURec601FullRangeToRGB * colourYCrCb, 1.0);\n}\n'), defineProperty(_shaders, CAMERA_FORMAT_RGB, COPY_FRAG_SHADER), defineProperty(_shaders, CAMERA_FORMAT_MULTIPLE, '\n  precision mediump float;\n  varying vec2 ' + VARYING_TEX_COORD + ';\n  const float FORMAT_NV12 = ' + FORMAT_NV12.toFixed(1) + ';\n  const float FORMAT_NV21 = ' + FORMAT_NV21.toFixed(1) + ';\n  const mat3 mNV2RGB =  mat3(1.,1.,1.,0.,-0.39465,2.03211,1.138983,-0.5806,0.);\n  uniform sampler2D uYTex;\n  uniform sampler2D uUVTex;\n  uniform float uFormat;\n  \n  void main(){\n    float y = texture2D(uYTex, ' + VARYING_TEX_COORD + ').r;\n    vec2 uv;\n    if(uFormat == FORMAT_NV21){\n       uv = texture2D(uUVTex, ' + VARYING_TEX_COORD + ').ra - 0.5;\n    }else if(uFormat == FORMAT_NV12){\n       uv = texture2D(uUVTex, ' + VARYING_TEX_COORD + ').ar - 0.5;\n    }\n    gl_FragColor = vec4(mNV2RGB * vec3(y,uv),1.0);\n  }\n  '), _shaders);
CameraSourceFilter.FORMAT_YpCbCr = CAMERA_FORMAT_YpCbCr;
CameraSourceFilter.FORMAT_RGB = CAMERA_FORMAT_RGB;
CameraSourceFilter.FORMAT_MULTIPLE = CAMERA_FORMAT_MULTIPLE;

/**
 * Created by brian on 19/07/2017.
 */
var CameraController = function (_Renderer) {
  inherits(CameraController, _Renderer);

  function CameraController(arg) {
    classCallCheck(this, CameraController);

    var _this = possibleConstructorReturn(this, (CameraController.__proto__ || Object.getPrototypeOf(CameraController)).call(this, arg));

    _this.camera = arg.camera;
    _this.filter = arg.filter;

    return _this;
  }

  createClass(CameraController, [{
    key: 'update',
    value: function update(gl, state) {
      var camera = this.camera;
      var filter = this.filter;
      var sx = 1,
          sy = 1,
          hasFrame = void 0;
      if (camera && camera.isDirty) {
        filter.disabled = false;
        camera.lock();
        var frames = camera.getCurrentFrames();
        var orientation = 0;
        if (frames instanceof HTMLVideoElement) {
          filter.setSourceVideo(frames);
          hasFrame = true;
        } else if (frames.length) {
          filter.setSamplerFrames(frames);
          filter.bufferSamplerData(gl, state);
          hasFrame = true;
        }
        camera.unlock();
        if (hasFrame) {
          this.onCurrentFrames(frames);
          var format = filter.format;
          if (format === CAMERA_FORMAT_MULTIPLE || format === CAMERA_FORMAT_I420) {
            orientation = frames[0].rotation;
            if (camera.facing === CAMERA_FACING_BACK) {
              sx = -1;
            }
          } else if (format === CAMERA_FORMAT_YpCbCr) {
            orientation = camera.orientation;
            if (camera.facing === CAMERA_FACING_FRONT) {
              orientation = 360 - orientation;
            } else {
              sx = -1;
            }
          } else if (format === CAMERA_FORMAT_RGB) {
            sy = -1;
            sx = -1;
          }
          filter.orientation = orientation;
          if (this.__invalid) {
            var mat = createMat3().rotate(Math.PI * orientation / 180).scale(sx, sy);
            filter.transformTexCoord(mat);
            this.__invalid = false;
          }
        }
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.disabled = true;
      this.camera.stop();
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.disabled = false;
      var camera = this.camera;
      if (!this.camera.isRunning) {
        camera.start();
      }
    }
  }, {
    key: 'onCurrentFrames',
    value: function onCurrentFrames(frames) {}
  }, {
    key: 'invalid',
    value: function invalid() {
      this.__invalid = true;
      get(CameraController.prototype.__proto__ || Object.getPrototypeOf(CameraController.prototype), 'invalid', this).call(this);
    }
  }]);
  return CameraController;
}(Renderer);

/**
 * Created by brian on 19/07/2017.
 */
var WebARRenderTask = function (_GLTask) {
  inherits(WebARRenderTask, _GLTask);

  function WebARRenderTask(arg) {
    classCallCheck(this, WebARRenderTask);

    var _this = possibleConstructorReturn(this, (WebARRenderTask.__proto__ || Object.getPrototypeOf(WebARRenderTask)).call(this, arg));

    var filter = new CameraSourceFilter({ name: 'source', format: getCameraFormat() });
    filter.disabled = true;
    if (arg.autoResize) {
      filter.addRenderMiddleware(resizeMiddleware);
    }
    _this.cameraController = new CameraController({ name: 'camera', filter: filter });
    _this.rootNode.addChild(_this.cameraController);
    _this.rootNode.addChild(filter);
    return _this;
  }

  createClass(WebARRenderTask, [{
    key: 'addFirstFrameMiddleware',
    value: function addFirstFrameMiddleware(dataSource, onFrame) {
      var cancel = this.rootNode.addUpdateMiddleware(function () {
        if (dataSource.isRunning && dataSource.isDirty) {
          cancel();
          requestAnimationFrame(onFrame);
        }
      });
      return cancel;
    }
  }, {
    key: 'addEmptyFrameMiddleware',
    value: function addEmptyFrameMiddleware(nativeCamera, onError) {
      var frameCount = 60,
          i = 0;
      var cancel = this.rootNode.addUpdateMiddleware(function () {
        if (!nativeCamera.isDirty) {
          if (++i == frameCount) {
            onError();
            cancel();
          }
        } else {
          cancel();
        }
      });
      return cancel;
    }
  }, {
    key: 'setCamera',
    value: function setCamera(camera) {
      var ctrl = this.cameraController;
      ctrl.camera = camera;
      ctrl.invalid();
    }
  }, {
    key: 'sourceFilter',
    get: function get$$1() {
      return this.rootNode.findChildByName('source');
    }
  }]);
  return WebARRenderTask;
}(GLTask);

function resizeMiddleware(gl) {
  var size = this.size;
  var canvas = gl.canvas;
  var w = size[0];
  var h = size[1];
  if (canvas.width != w || canvas.height != h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
}

function getCameraFormat() {
  if (isAndroid()) {
    var session = getUCARSession();
    return session.version == 2 ? CAMERA_FORMAT_MULTIPLE : CAMERA_FORMAT_I420;
  } else if (isiOS()) {
    return CAMERA_FORMAT_YpCbCr;
  }
  return CAMERA_FORMAT_RGB;
}

/**
 * Created by brian on 10/08/2017.
 */
var PRO_RENDER_TASK = createSymbol('renderTask');
var PRO_NATIVE_CAMERA = createSymbol('nativeCamera');
var PRO_OPENED = createSymbol('opened');

var WebCamera = function () {
  function WebCamera(gl, nativeCamera, config) {
    classCallCheck(this, WebCamera);

    this[PRO_RENDER_TASK] = new WebARRenderTask({ gl: gl, autoResize: config.autoResize });
    this[PRO_NATIVE_CAMERA] = nativeCamera;
    this.manuallyRender = config.manuallyRender;
    this.__hasFirstFrame = false;
  }

  createClass(WebCamera, [{
    key: 'open',
    value: function open() {
      var _this = this;

      if (!this[PRO_OPENED]) {
        var task = this[PRO_RENDER_TASK];
        var nativeCamera = this[PRO_NATIVE_CAMERA];
        task.watchDocument();
        task.setCamera(nativeCamera);
        this.resume();

        task.addFirstFrameMiddleware(nativeCamera, function () {
          _this.__hasFirstFrame = true;
          emitEvent(_this, EVT_CAMERA_OPEN, { target: _this });
        });

        //resume camera when document resumes
        task.addEventListener(EVT_RENDER_RESUME, function () {
          if (!_this.__manuallyPaused) {
            _this.resume();
            if (isAndroid()) {
              //todo UC 多次进入后台后camera会发生错误,无法拿到数据
              task.addEmptyFrameMiddleware(nativeCamera, function () {
                emitEvent(_this, EVT_AR_ERROR, { target: _this });
              });
            }
          }
        });
        window.addEventListener('unload', this.__unloadHandler = function () {
          return _this.close();
        });
        this[PRO_OPENED] = true;
      }
    }
  }, {
    key: 'close',
    value: function close() {
      return this.closeAsync();
    }
  }, {
    key: 'closeAsync',
    value: function closeAsync() {
      var _this2 = this;

      var pending = getDefaultNativeCameraService().closeAsync(this[PRO_NATIVE_CAMERA]).then(closeEvt, closeEvt);
      this[PRO_RENDER_TASK].dispose();
      Object.getOwnPropertyNames(WebCamera.prototype).forEach(function (key) {
        return isFunc(_this2[key]) && (_this2[key] = throwIfCalled);
      });
      var self = this;
      this[PRO_NATIVE_CAMERA] = null;
      return pending;

      function closeEvt(error) {
        emitEvent(self, EVT_CAMERA_CLOSE, { target: self, error: error });
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      var task = this[PRO_RENDER_TASK];
      task.stop();
      task.cameraController.pause();
      emitEvent(this, EVT_CAMERA_PAUSE, { target: this });
      this.__manuallyPaused = true;
    }
  }, {
    key: 'resume',
    value: function resume() {
      var task = this[PRO_RENDER_TASK];
      if (!this.manuallyRender) {
        task.loop();
      }
      var cameraController = task.cameraController;
      cameraController.resume();
      emitEvent(this, EVT_CAMERA_RESUME, { target: this });
      this.__manuallyPaused = false;
    }
  }, {
    key: 'getFrameSize',
    value: function getFrameSize() {
      return this[PRO_RENDER_TASK].sourceFilter.size;
    }
  }, {
    key: '__forceRender',
    value: function __forceRender() {
      var task = this[PRO_RENDER_TASK];
      var nativeCamera = this[PRO_NATIVE_CAMERA];
      if (nativeCamera.isDirty || this.__hasFirstFrame) {
        task.invalid();
      }
      task.render();
    }
  }]);
  return WebCamera;
}();

wrapConstructorAsEventTarget(WebCamera);

function throwIfCalled() {
  throw Error('Disposed object');
}

function setNativeCameraFrameCallback(webCamera, cb) {
  var cameraController = webCamera[PRO_RENDER_TASK].cameraController;
  cameraController.onCurrentFrames = cb;
}

/**
 * Created by brian on 10/08/2017.
 */
function getWebCameraAsync(gl, config) {
  config = config || {};
  var facing = +(config.facing || CAMERA_FACING_BACK);
  var quality = +(config.quality || CAMERA_QUALITY_DEFAULT);
  if (!(gl instanceof WebGLRenderingContext) && !config.useGLProxy) {
    return Promise.reject(makeError(ERROR_CODE_INVALID_RENDER_TARGET));
  }
  return getDefaultNativeCameraService().getNativeCameraAsync(facing, quality).then(function (camera) {
    return new WebCamera(gl, camera, config);
  });
}

/**
 * Created by brian on 03/08/2017.
 */
var FPSMetrics = function () {
  function FPSMetrics(arg) {
    classCallCheck(this, FPSMetrics);

    this.sampleCount = 30;
    if (arg) {
      if (isFunc(arg.onFPS)) {
        this.onFPS = arg.onFPS;
      }
      if (isObj(arg.task)) {
        this.task = arg.task;
      }
    }
  }

  createClass(FPSMetrics, [{
    key: 'onFPS',
    value: function onFPS(fps, renderTime) {}
  }, {
    key: 'detachTask',
    value: function detachTask() {}
  }, {
    key: 'task',
    set: function set$$1(t) {
      var _this = this;

      if (this.__task != t) {
        this.__task = t;
        this.detachTask();
        var fpsSamples = [];
        var intervalSamplers = [];
        var now = Date.now();
        var lastTime = now;
        var h0 = function h0() {
          now = Date.now();
          fpsSamples.push(now - lastTime);
          lastTime = now;
          while (fpsSamples.length > _this.sampleCount) {
            fpsSamples.shift();
          }
        };
        var h1 = function h1() {
          intervalSamplers.push(Date.now() - now);
          while (intervalSamplers.length > _this.sampleCount) {
            intervalSamplers.shift();
          }_this.onFPS(Math.round(1000 / avg(fpsSamples)), avg(intervalSamplers));
        };
        t.addEventListener(EVT_BEFORE_RENDER, h0);
        t.addEventListener(EVT_AFTER_RENDER, h1);
        this.detachTask = function () {
          t.removeEventListener(EVT_BEFORE_RENDER, h0);
          t.removeEventListener(EVT_AFTER_RENDER, h1);
        };
      }
    }
  }]);
  return FPSMetrics;
}();

function avg(numbers) {
  var sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

/**
 * Created by brian on 11/08/2017.
 */
function createFPSMetricsForCamera(onFPS, camera) {
  return new FPSMetrics({
    onFPS: onFPS, task: camera[PRO_RENDER_TASK]
  });
}

/**
 * Created by brian on 20/07/2017.
 */
function printLog(err) {
  var p = document.createElement('p');
  p.innerHTML += (err instanceof Error ? err.message : err) + '\n';
  $('.log').appendChild(p);
}

function $(slt, ele) {
  return (ele || document).querySelector(slt);
}

function $$(slt, ele) {
  return Array.prototype.slice.call((ele || document).querySelectorAll(slt));
}

window.onload = init;

function init() {
  var webCamera = void 0;
  var detector = void 0;
  var analysisFlag = false;
  var gl = $('#gl-cvs').getContext('webgl');

  openCamera();

  $('.restart-camera').addEventListener('click', function () {
    if (webCamera) {
      webCamera.closeAsync().then(openCamera);
      webCamera = null;
    }
  });

  $('.reload-markers').addEventListener('click', function () {
    detector.setMarkers($$('input[type="checkbox"]:checked').map(function (i) {
      return i.value;
    }));
  });
  $('.start-analysis').addEventListener('click', function () {
    if (analysisFlag) {
      detector.pause();
    } else {
      detector.resume();
    }
    analysisFlag = !analysisFlag;
    $('.info-analysis').innerText = analysisFlag ? 'Analyzing...' : '';
  });
  $('.sp0').addEventListener('click', function () {
    analysisFlag = true;
    detector.resume();
    setTimeout(function () {
      return detector.setMarkers($$('input[type="checkbox"]:checked').map(function (i) {
        return i.value;
      }));
    }, 20);
  });
  $('.sp1').addEventListener('click', function () {
    detector.setMarkers([0, 123, {}]);
  });
  $('.sp2').addEventListener('click', pushWindow);

  function openCamera() {
    var facing = +$('input[name="camera-facing"]:checked').value;
    var quality = +$('.quality').value;
    getWebCameraAsync(gl, {
      facing: facing,
      quality: quality,
      autoResize: true
    }).then(onCamera, function (e) {
      return printLog(JSON.stringify(e));
    });
  }

  function onCamera(_webCamera) {
    if (webCamera) {
      webCamera.close();
    }
    if (!detector) {
      detector = getUCARSession().setDetector('MarkerDetector');
    }
    webCamera = _webCamera;
    webCamera.open();
    setNativeCameraFrameCallback(webCamera, function (frames) {
      var f0 = frames[0];
      if (f0 && f0.format) {
        $('.format').innerHTML = 'format:' + f0.format;
      }
    });
    createFPSMetricsForCamera(function (fps, renderTime) {
      $('.fps').innerText = 'fps:' + fps + ' render time:' + renderTime.toFixed(2) + 'ms';
    }, _webCamera);
    webCamera.addEventListener(EVT_CAMERA_OPEN, function () {
      var size = webCamera.getFrameSize();
      printLog('--first frame:' + size[0] + 'x' + size[1] + '--');
    });
    webCamera.addEventListener(EVT_AR_ERROR, function () {
      printLog('Web AR Error occurs');
    });
  }

  getUCARSession().addEventListener('DetectorResult', function (result) {
    try {
      var _JSON$parse = JSON.parse(result),
          value = _JSON$parse.value,
          type = _JSON$parse.type;

      $('.info-detector').textContent = type + ':' + value;
      if (type === 'recognized' && analysisFlag) {
        detector.resume();
        $('.activeId').innerText = value;
      }
    } catch (ex) {
      printLog(ex);
    }
  });
  function pushWindow() {
    AlipayJSBridge.call('pushWindow', {
      url: window.location.href
    });
  }
}

})));

