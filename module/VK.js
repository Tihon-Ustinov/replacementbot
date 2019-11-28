const VK = require('vksdk');
const settings = require('../module/settings');
const vk = new VK({
  'appId': 6357772,
  'appSecret': '9Kp71VYHDwSrPqBvfIgW',
  'language': 'ru',
  'secure ': true,
  'https': false,
  'mode': 'oauth'
});


vk.on('serverTokenReady', function(_o) {
  vk.setToken(_o.access_token);
});
vk.setSecureRequests(true);
vk.setToken(settings.token_group);
settings.VK = vk;


module.exports = {
  VK: vk
};
