const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "chor",
    version: "2.2.0",
    author: "CYBER ☢️ TEAM | Goat v2 Stable",
    category: "image",
    shortDescription: {
      en: "Scooby Doo meme (chor)"
    },
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const uid = Object.keys(event.mentions)[0] || event.senderID;
      const cachePath = path.join(__dirname, "cache", `chor_${uid}.jpg`);

      // Facebook avatar
      const avatar = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;

      // Scooby Doo meme (memegen)
      const memeUrl =
        `https://api.memegen.link/images/scooby/${encodeURIComponent("চিপা খোর")}/${encodeURIComponent("চিপায় গিয়ে ধরা")}.png?watermark=none&avatar=${encodeURIComponent(avatar)}`;

      const img = await axios.get(memeUrl, {
        responseType: "arraybuffer",
        timeout: 15000
      });

      fs.writeFileSync(cachePath, img.data);

      api.sendMessage(
        {
          body: "চিপা খোর চিপায় গিয়ে ধরা খাইছে 🤣🤣",
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => fs.unlinkSync(cachePath),
        event.messageID
      );
    } catch (e) {
      api.sendMessage(
        "❌ Meme server এখন busy বা blocked\n⏳ একটু পরে আবার চেষ্টা করো",
        event.threadID,
        event.messageID
      );
    }
  }
};
