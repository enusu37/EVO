+cmd install kill.js const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "kill",
    version: "1.0.0",
    author: "CYBER ☢️ TEAM | Goat v2",
    category: "image",
    shortDescription: {
      en: "Kill meme (fun)"
    },
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const mentionID = Object.keys(event.mentions)[0];
      if (!mentionID) {
        return api.sendMessage(
          "⚠️ কাকে kill করবো? কাউকে mention করো 😈",
          event.threadID,
          event.messageID
        );
      }

      const senderID = event.senderID;
      const cachePath = path.join(
        __dirname,
        "cache",
        `kill_${Date.now()}.gif`
      );

      const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
      const avatar2 = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`;

      // Kill meme API (Popcat – same family as slap)
      const killUrl = `https://api.popcat.xyz/kill?user1=${encodeURIComponent(
        avatar1
      )}&user2=${encodeURIComponent(avatar2)}`;

      const res = await axios.get(killUrl, {
        responseType: "arraybuffer",
        timeout: 15000
      });

      fs.writeFileSync(cachePath, res.data);

      api.sendMessage(
        {
          body: "☠️ একেবারে শেষ করে দিলো 😈",
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => fs.unlinkSync(cachePath),
        event.messageID
      );
    } catch (e) {
      api.sendMessage(
        "❌ Kill meme generate করা যায়নি\n⏳ একটু পরে আবার চেষ্টা করো",
        event.threadID,
        event.messageID
      );
    }
  }
};
