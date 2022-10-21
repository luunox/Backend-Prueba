/** @format */

export const luhnCheck = (num: number) => {
  if (num.toString().length < 13) return false;
  if (num.toString().length > 16) return false;
  let str = (num + "").split("").reverse();
  let arr = str.map((x) => parseInt(x));
  let lastDigit = arr.splice(0, 1)[0];
  let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
  sum += lastDigit;
  return sum % 10 === 0;
};

export const checkPk = (id: string) => {
  let len = id.length;
  let [hasLower, hasUpper, hasNumber] = [false, false, false];
  while (len--) {
    if (!hasLower) id[len].match(/[a-z]/g) && (hasLower = true);
    if (!hasUpper) id[len].match(/[A-Z]/g) && (hasUpper = true);
    if (!hasNumber) id[len].match(/[0-9]/g) && (hasNumber = true);
  }

  if (!hasLower || !hasUpper || !hasNumber) return false;
  else return true;
};

export const checkCvv = (cvv: number) => (cvv ? String(cvv).match(/^\d{3,4}$/g) || false : false);
export const checkMonth = (month: number) => (month ? String(month).match(/^(0[1-9]|1[0-2]|[1-9])$/g) || false : false);
export const checkEmail = (email: string) => (email ? email.match(/^.{5,100}@(yahoo.es|hotmail.com|gmail.com)$/i) || false : false);
export const checkYear = (year: number) => {
  const yNow = new Date().getFullYear().toString();
  const [anio, uDigit, next5] = [yNow.substring(0, 3), yNow.charAt(3), Number(yNow.charAt(3)) + 5];
  return year ? String(year).match(`^${anio}[${uDigit}-${next5}]$`) || false : false;
};
