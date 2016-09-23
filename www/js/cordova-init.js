/* jshint browser: true, jquery: true, devel: true */
/* globals PushNotification */

(function() {
    
    "use strict";
    
    var loader = {

      initialize: function() {
        this.bindEvents();
      },

      // Cordova events: https://cordova.apache.org/docs/en/latest/cordova/events/events.html
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },

      onDeviceReady: function() {
          
          var dev = window.device;
          var storage = window.localStorage;
          
          if (dev && dev.uuid) {
              
              console.log('getting user for device.uuid', dev.uuid);
              
              $.get(
                  "http://www.toeknee.io:3000/api/devices/findOne?filter[where][deviceId]=" + dev.uuid
              ).done(function(data) {
                  if (data && data.userId) {
                      storage.setItem('userId', data.userId);
                      //storage.removeItem('tryLogin');
                      getIdentity(data);
                  }
              }).fail(function(err) {
                  console.error("failed to get userId using device.uuid:", err.message);
              });  
              
          }

          loader.push = PushNotification.init({
            "android": {
              "senderID": "184977555503"
            },
            "ios": {
              "sound": true,
              "vibration": true,
              "badge": true
            },
            "windows": {}
          });

          loader.push.on('registration', function(data) {

              var storedRegId = storage.getItem('registrationId');

              if (!storedRegId || storedRegId !== data.registrationId) {

                  storage.setItem('registrationId', data.registrationId);
                  
                  var devPlatform = dev.platform ? dev.platform.toLowerCase() : "";
                  
                  $.post(
                      "http://www.toeknee.io:3000/api/installations",
                      { 
                          "appId": "com.bitsmitten.topramen." + devPlatform,
                          "deviceToken": data.registrationId,
                          "deviceType": devPlatform,
                          "status": "Active",
                          "userId": storage.getItem('userId')
                      }
                  ).done(function(msg) {
                      console.log("regId saved to server:", JSON.stringify(msg));
                  }).fail(function(err) {
                      console.error("failed to save regId to server:", err.message);
                  });    

              }            

          });

          loader.push.on('error', function(err) {
              console.error("push err:", err.message);
          });

          loader.push.on('notification', function(data) {
              console.log("received push notification:", JSON.stringify(data));
          });

          navigator.splashscreen.hide();

      }

    };

    loader.initialize();

})();