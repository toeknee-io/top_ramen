(function TRUtilsIife({ alert, console: { error: cError } }) {
  window.TRUtils = window.tru = class TRUtils {

    static hasOwnProp(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    static error(msg, { ns, err }) {
      alert(msg);
      cError(err ? (`${ns} error: ${err.stack || err.message}`) : msg);
    }

    static getDeclineChallengeOpts() {
      return [
        window.navigator.app.exitApp,
        window.pushActions.viewChallenge,
        window.pushActions.viewChallenges,
        window.navigator.app.exitApp,
      ];
    }

  };
}(window));
