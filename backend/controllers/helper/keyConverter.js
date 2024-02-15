// const publicKey = JSON.parse(process.env.pk)
const toHex = (key) => {
  return key
    .map((num) => {
      let hex = num.toString(16);
      if (hex.length == 1) hex = `0${hex}`;
      if (hex.length == 0) hex = `00`;
      return hex;
    })
    .join("");
};
const toNum = (key) => {
  return key.match(/.{1,2}/g).map((hex) => {
    return parseInt(hex, 16);
  });
};
module.exports = { toNum, toHex };
