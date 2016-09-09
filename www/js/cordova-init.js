/**
 * Initialize Cordova plugins
 * For more Corova plugins, please go to [Cordova Plugin Registry](http://plugins.cordova.io/#/).
 * In Intel XDK, you can enable / disable / add Cordova Plugins on
 * Projects Tab
 *  -> Cordova 3.x Hybrid Mobile App Settings
 *     -> Plugins and Permissions
 */
 /* jshint browser:true */
// Listen to deviceready event which is fired when Cordova plugins are ready

(function() {
        
    var loader = {

      initialize: function() {
        this.bindEvents();
      },

      // Cordova events: https://cordova.apache.org/docs/en/latest/cordova/events/events.html
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },

      onDeviceReady: function() {
          
          try {

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
                  
                  //console.log("regId from event: " + data.registrationId);
                  
                  var storedRegId = window.localStorage.getItem('registrationId');
                  
                  //console.log('regId from local store: ' + storedRegId);
                  
                  if (!storedRegId || storedRegId !== data.registrationId) {

                      window.localStorage.setItem('registrationId', data.registrationId);

                      $.post(
                          "http://www.toeknee.io:3000/api/devices",
                          { "deviceId": data.registrationId }
                      ).done(function(msg) {
                          console.log("regId saved to server: " + msg);
                      }).fail(function(err) {
                          console.error("failed to save regId to server: " + err.message);
                      });    

                  }            

              });

              loader.push.on('error', function(err) {
                  console.error("push err: " + err.message);
              });

              loader.push.on('notification', function(data) {
                  console.log('notification event: ' + JSON.stringify(data));
              });

              navigator.splashscreen.hide();
              
        } catch (err) {
          console.error('cordova-init err: ' + err);
        }

      }

    };

    loader.initialize();

})();