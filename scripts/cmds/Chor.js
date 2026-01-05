const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "chor",
    version: "2.1.0",
    author: "CYBER ☢️ TEAM | Goat v2 Safe",
    category: "image",
    shortDescription: {
      en: "Scooby Doo style meme"
    },
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const uid = Object.keys(event.mentions)[0] || event.senderID;
      const cachePath = path.join(__dirname, "cache", `chor_${uid}.jpg`);

      // 🔥 API that generates Scooby meme
      const imgUrl = `https://api.popcat.xyz/scooby?image=https://graph.facebook.com/${uid}/picture?width=512&height=512`;

      const img = await axios.get(imgUrl, { responseType: "arraybuffer" });
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
        "❌ Meme generate করতে সমস্যা হচ্ছে",
        event.threadID,
        event.messageID
      );
    }
  }
};
