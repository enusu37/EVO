const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

module.exports = {
  config: {
    name: "autolink",
    version: "2.0",
    author: "ALVI-BOSS",
    role: 0,
    category: "media",
    shortDescription: "Auto link video downloader (Goat Bot v2 style)"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const messageID = event.messageID;
    const body = event.body || "";

    // link detect
    const links = body.match(/(https?:\/\/[^\s]+)/g);
    if (!links) return;

    const uniqueLinks = [...new Set(links)];

    // ⏳ reaction
    api.setMessageReaction("⏳", messageID, () => {}, true);

    // 🔔 initial message
    const infoMsg = await api.sendMessage(
      "🧑‍🦯 দ্বারা গরিব ডাউনলোড করে দিচ্ছে...\n⏬ একটু অপেক্ষা করো",
      threadID
    );

    // auto delete info msg
    setTimeout(() => {
      api.unsendMessage(infoMsg.messageID);
    }, 3000);

    let success = 0;
    let failed = 0;

    for (const link of uniqueLinks) {
      try {
        const { title, filePath } = await downloadVideo(link);
        if (!filePath || !fs.existsSync(filePath)) throw new Error();

        const sizeMB = fs.statSync(filePath).size / (1024 * 1024);
        if (sizeMB > 25) {
          fs.unlinkSync(filePath);
          failed++;
          continue;
        }

        await api.sendMessage(
          {
            body: `🎬 ${title || "ভিডিও"}`,
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          () => fs.unlinkSync(filePath)
        );

        success++;
      } catch (e) {
        failed++;
      }
    }

    // final reaction
    const react =
      success > 0 && failed === 0 ? "✅" :
      success > 0 ? "⚠️" : "❌";

    api.setMessageReaction(react, messageID, () => {}, true);
  }
};
