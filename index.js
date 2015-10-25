var globals = {};

if ("jenscript" in global) globals.jenscript = global.jenscript;

module.exports = require("./jenscript");

if ("jenscript" in globals) global.jenscript = globals.jenscript; else delete global.jenscript;