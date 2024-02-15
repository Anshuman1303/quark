const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

function filePath() {
  const e = new Error();
  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e.stack.split("\n")[3]);
  return `${match[1]}:${match[2]}:${match[3]}`;
}

const log = async (fileName, ...msg) => {
  await fsPromises.appendFile(
    path.join(__dirname, "..", "logs", `${fileName}.log`),
    `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}\t|\t${uuid()}\t|\t${msg.join("\t|\t")}\n`
  );
};
const logEvent = async (req, res, next) => {
  log("event", req.method, req.path);
  next();
};
const logError = async (error) => {
  log("error", error, filePath());
};

module.exports = { logEvent, logError, log };
