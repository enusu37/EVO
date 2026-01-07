const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love",
    aliases: ["pair"],
    version: "7.3.6",
    author: "CYBER BOT TEAM",
    role: 0,
    shortDescription: {
      en: "Generate love pair image"
    },
    category: "image",
    guide: {
      en: "{pn} @mention"
    },
    cooldown: 5,
    dependencies: {
      axios: "",
      "fs-extra": "",
      path: "",
      jimp: ""
    }
  },

  onLoad: async function () {
    const dir = path.join(__dirname, "cache", "canvas");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const imagePath = path.join(dir, "arr2.png");

    if (!fs.existsSync(imagePath)) {
      const data = (
        await axios.get("https://i.imgur.com/iaOiAXe.jpeg", {
          responseType: "arraybuffer"
        })
      ).data;

      fs.writeFileSync(imagePath, Buffer.from(data));
    }
  },

  onStart: async function ({ event, message }) {
    const mentionIDs = Object.keys(event.mentions);

    if (mentionIDs.length === 0) {
      return message.reply("Please mention 1 person.");
    }

    const senderID = event.senderID;
    const targetID = mentionIDs[0];

    try {
      const canvasDir = path.join(__dirname, "cache", "canvas");
      const template = path.join(canvasDir, "arr2.png");

      if (!fs.existsSync(template)) {
        return message.reply("Template image missing!");
      }

      let img = await Jimp.read(template);

      const avatarOne = path.join(canvasDir, `avt_${senderID}.png`);
      const avatarTwo = path.join(canvasDir, `avt_${targetID}.png`);

      await downloadAvatar(senderID, avatarOne);
      await downloadAvatar(targetID, avatarTwo);

      let c1 = await Jimp.read(avatarOne);
      let c2 = await Jimp.read(avatarTwo);

      c1.circle();
      c2.circle();

      img.composite(c1.resize(200, 200), 70, 110);
      img.composite(c2.resize(200, 200), 465, 110);

      const out = path.join(canvasDir, `pair_${senderID}_${targetID}.png`);

      await img.writeAsync(out);

      fs.unlinkSync(avatarOne);
      fs.unlinkSync(avatarTwo);

      const captions = ["Love Pair Generated!"];
      return message.reply({
        body: captions[0],
        attachment: fs.createReadStream(out)
      });

    } catch (e) {
      console.log(e);
      return message.reply("⚠️ | Failed to generate image.");
    }
  }
};

async function downloadAvatar(uid, savePath) {
  const data = (
    await axios.get(
      `https://graph.facebook.com/${uid}/picture?width=512&height=512`,
      { responseType: "arraybuffer" }
    )
  ).data;

  fs.writeFileSync(savePath, Buffer.from(data));
}
