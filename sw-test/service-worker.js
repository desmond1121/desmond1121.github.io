'use strict';

var CACHE_VERSION = 'cache-v1';
var CACHE_FILE = 'index.html';
var CACHE_TYPE = 'htmlOrImg'; // 缓存类型, imgOnly、htmlOrImg
// 配置 html 缓存白名单, 在白名单中的才缓存. 如果 CACHE_TYPE = imgOnly, 跳过白名单
var CACHE_HTML = ['swHtmlTest.html'];

// 默认只缓存render的
var HOSTNAME_WHITELIST = ['render.alipay', 'os.alipayobjects.com', 'gw.alipayobjects.com', 'a.alipayobjects.com', 'as.alipayobjects.com', 'gw.alipayobjects.com', 'zos.alipayobjects.com', 'localhost'];
var _self = this;

function sendMessageToPage(client, msg){
  if (!client) {
    return;
  }
  client.postMessage({
    msg,
  });
}

self.addEventListener('install', (event) => {
  console.log('install version: ' + CACHE_VERSION);
  
  event.waitUntil(
    // 打开缓存, 每次更新版本号
    caches.open(CACHE_VERSION).then(function (cache) {
      return fetch(CACHE_FILE).then(function (response) {
        if (response.status !== 200) {
          // throw new TypeError('bad response status');
          console.error('bad response status');
        }
        return cache.put(CACHE_FILE, response);
      });
    }).then(() => {
      clients.get(event.clientId).then(client => {
        sendMessageToPage(client, 'sw_installed')
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  console.info('service worker activated.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // 开始执行
      console.info('cacheName', cacheNames);
      return Promise.all(cacheNames.map(function (cacheName) {
        if (cacheName !== CACHE_VERSION) {
          return caches.delete(cacheName).then(function () {
            console.log('Cache with name ' + cacheName + ' is deleted');
          });
        }
        return Promise.resolve();
      }));
    }).then(() => {
      clients.get(event.clientId).then(client => {
        sendMessageToPage(client, 'sw_activated')
      });
    })
  );
});

function requestBackend(event) {
  var url = event.request.clone();
  return fetch(url).then(function (res) {
    console.log('from fetch');
    // 过滤错误状态
    if (!res || res.status !== 200 || res.type !== 'basic') {
      return res;
    }
    var response = res.clone();
    caches.open(CACHE_VERSION).then(function (cache) {
      cache.put(event.request, response);
    });

    return res;
  });
}

self.addEventListener('fetch', function (event) {
  // 监听各个网络请求
  var url = event.request.url;
  var isHtml = /text\/html/.test(event.request.headers.get('Accept'));
  var isImage = /^image/.test(event.request.headers.get('Accept'));

  var acceptType = false;
  if (CACHE_TYPE === 'imgOnly') {
    acceptType = isImage;
  } else {
    var inCacheHtml = CACHE_HTML.some(function (item) {
      return url.indexOf(item) > 0;
    });
    acceptType = isHtml && inCacheHtml || isImage;
  }

  if (HOSTNAME_WHITELIST.indexOf(new URL(url).hostname) > -1 && acceptType) {
    console.log('fetch url: ' + url);
    event.respondWith(caches.open(CACHE_VERSION).then(function (cache) {
      return cache.match(event.request);
    }).then(function (res) {
      // 有缓存也要 request 最新, 避免 cacheOnly
      var backEndRes = requestBackend(event);
      if (res) {
        console.log('from cache');
        return res;
      }
      return backEndRes;
    }).catch(function (err) {
      console.error('match offline', err);
      return caches.open(CACHE_VERSION).then(function (cache) {
        return cache.match(CACHE_FILE);
      });
    }));
  }
});