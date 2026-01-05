const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autoreplybot",
  version: "6.0.3",
  hasPermission: 0,
  credits: "ALVI → Goat Bot v2 style",
  description: "Goat Bot v2 style auto-response with fun triggers",
  commandCategory: "No Prefix",
  usages: "[trigger]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const { threadID, messageID, senderID, body } = event;
    if (!body || senderID === api.getCurrentUserID()) return;

    const name = await Users.getNameUser(senderID);
    const msg = body.toLowerCase().trim();

    const goatResponses = {
      "hi": `হেই ${name}! কী খবর? 😎✌️`,
      "hello": `ওহে! কেমন আছিস, ${name}? 🐐`,
      // Add more triggers/responses in Goat Bot v2 style
    };

    if (goatResponses[msg]) {
      return api.sendMessage(goatResponses[msg], threadID, messageID);
    }

  } catch (e) {
    console.log("Goat Bot v2 AutoReply Error:", e);
  }
};

module.exports.run = async function ({ api, event, Users }) {
  return;
};
