const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "chor",
    version: "3.0.0",
    author: "CYBER ☢️ TEAM | Goat v2 Stable",
    category: "image",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const uid = Object.keys(event.mentions)[0] || event.senderID;
      const cacheDir = path.join(__dirname, "cache");
      const outPath = path.join(cacheDir, `chor_${uid}.png`);

      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const bgPath = path.join(cacheDir, "chor_bg.png");
      if (!fs.existsSync(bgPath)) {
        return api.sendMessage(
          "❌ Chor template image missing\n📌 chor_bg.png cache folder এ রাখো",
          event.threadID,
          event.messageID
        );
      }

      // download avatar
      const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
      const avatar = await axios.get(avatarUrl, { responseType: "arraybuffer" });

      // simple merge (no canvas)
      const bg = fs.readFileSync(bgPath);
      const finalImage = Buffer.concat([bg, avatar.data]);

      fs.writeFileSync(outPath, finalImage);

      api.sendMessage(
        {
          body: "চিপা খোর চিপায় গিয়ে ধরা খাইছে 😆",
          attachment: fs.createReadStream(outPath)
        },
        event.threadID,
        () => fs.unlinkSync(outPath),
        event.messageID
      );

    } catch (e) {
      api.sendMessage(
        "❌ Chor command run করতে সমস্যা হচ্ছে",
        event.threadID,
        event.messageID
      );
    }
  }
};
