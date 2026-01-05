const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "kill",
    version: "3.0.0",
    author: "CYBER ☢️ TEAM | Goat v2 Stable",
    category: "image",
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

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const cachePath = path.join(cacheDir, `kill_${Date.now()}.png`);

      // Template image from imgur
      const templateUrl = "https://i.imgur.com/7KXz7qL.png";
      const template = await axios.get(templateUrl, {
        responseType: "arraybuffer"
      });

      // Download avatars
      const senderAvatar = await axios.get(
        `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
      );

      const targetAvatar = await axios.get(
        `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
      );

      // Simple merge: just concat template + avatars (basic hack)
      const finalImage = Buffer.concat([template.data, senderAvatar.data, targetAvatar.data]);

      fs.writeFileSync(cachePath, finalImage);

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
      console.error(e);
      api.sendMessage(
        "❌ Kill command run করতে সমস্যা হচ্ছে",
        event.threadID,
        event.messageID
      );
    }
  }
};
