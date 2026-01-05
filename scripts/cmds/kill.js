const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "kill",
    version: "4.0.0",
    author: "CYBER ☢️ TEAM | Goat v2 Stable",
    category: "image",
    cooldowns: 5,
    shortDescription: { en: "Kill meme (fun)" }
  },

  onStart: async function ({ api, event }) {
    try {
      const mentionID = Object.keys(event.mentions)[0];
      if (!mentionID)
        return api.sendMessage(
          "⚠️ কাকে kill করবো? কাউকে mention করো 😈",
          event.threadID,
          event.messageID
        );

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const cachePath = path.join(cacheDir, `kill_${Date.now()}.gif`);

      // Stable Popcat API (Kill meme)
      const url = `https://api.popcat.xyz/kill?user1=${event.senderID}&user2=${mentionID}`;

      const res = await axios.get(url, {
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
      console.error(e);
      api.sendMessage(
        "❌ Kill meme generate করা যায়নি\n⏳ একটু পরে আবার চেষ্টা করো",
        event.threadID,
        event.messageID
      );
    }
  }
};
