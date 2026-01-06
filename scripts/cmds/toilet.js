const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp"); // ✅ corrected

module.exports = {
  config: {
    name: "toilet",
    version: "1.0.0",
    role: 0,
    credits: "CYBER BOT TEAM",
    description: "Mention করলে টয়লেট meme generate করবে",
    category: "user",
    usages: "@mention",
    cooldowns: 5,
    dependencies: {}
  },

  onLoad: async function () {
    const cacheDir = path.join(__dirname, "cache");
    const toiletImagePath = path.join(cacheDir, "toilet.png");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    if (!fs.existsSync(toiletImagePath)) {
      try {
        const imageBuffer = (
          await axios.get(
            "https://drive.google.com/uc?id=13ZqFryD-YY-JTs34lcy6b_w36UCCk0EI&export=download",
            { responseType: "arraybuffer" }
          )
        ).data;

        fs.writeFileSync(toiletImagePath, Buffer.from(imageBuffer));
        console.log("✅ Toilet image downloaded successfully!");
      } catch (err) {
        console.log("❌ Failed to download toilet image:", err.message);
      }
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    const mentionedIDs = Object.keys(event.mentions || {});
    const mentionedID = mentionedIDs[0];

    if (!mentionedID) {
      return api.sendMessage("⚠️ | Please tag 1 person", threadID, messageID);
    }

    try {
      const outputPath = await this.makeImage({ senderID, mentionedID });

      return api.sendMessage(
        {
          body: "বেশি বাল পাকলামির জন্য তোরে টয়লেটে ফেলে দিলাম 🤣🤮",
          attachment: fs.createReadStream(outputPath)
        },
        threadID,
        () => fs.unlinkSync(outputPath),
        messageID
      );
    } catch (err) {
      return api.sendMessage(
        "❌ | Meme generate করতে সমস্যা হয়েছে\n" + err.message,
        threadID,
        messageID
      );
    }
  },

  makeImage: async function ({ senderID, mentionedID }) {
    const cacheDir = path.join(__dirname, "cache");

    const toiletBase = await Jimp.read(path.join(cacheDir, "toilet.png"));

    const senderAvatarPath = path.join(cacheDir, `avt_${senderID}.png`);
    const mentionedAvatarPath = path.join(cacheDir, `avt_${mentionedID}.png`);

    const access_token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

    // Fetch sender avatar
    const senderAvatar = (
      await axios.get(
        `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${access_token}`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(senderAvatarPath, Buffer.from(senderAvatar));

    // Fetch mentioned avatar
    const mentionedAvatar = (
      await axios.get(
        `https://graph.facebook.com/${mentionedID}/picture?width=512&height=512&access_token=${access_token}`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(mentionedAvatarPath, Buffer.from(mentionedAvatar));

    // Make circular avatars
    const senderCircular = await this.circle(senderAvatarPath);
    const mentionedCircular = await this.circle(mentionedAvatarPath);

    const outputPath = path.join(cacheDir, `toilet_${senderID}_${mentionedID}.png`);

    toiletBase
      .resize(292, 345)
      .composite(senderCircular.resize(70, 70), 100, 200)
      .composite(mentionedCircular.resize(70, 70), 160, 200);

    const finalBuffer = await toiletBase.getBufferAsync("image/png");
    fs.writeFileSync(outputPath, finalBuffer);

    // Clean up temp avatars
    fs.unlinkSync(senderAvatarPath);
    fs.unlinkSync(mentionedAvatarPath);

    return outputPath;
  },

  circle: async function (imagePath) {
    const img = await Jimp.read(imagePath);
    img.circle();
    return img;
  }
};
