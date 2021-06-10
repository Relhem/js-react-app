export default class validationUtils {

  static checkIP(ip) {
    return /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(ip);
  };

  static checkPort(port) {
    if (this.isNumber(port)) {
      const number = Number(port);
      if (number < 0 || number > 65535) return false;
      return true;
    }
  };

  static isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}