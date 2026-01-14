const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "antibadwordData.json");
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));

const badWords = [
  "শালা",
  "চোদ",
  "মাগি",
  "খানকি",
  "fuck",
  "shit",
  "bitch"
];

module.exports = {
  config: {
    name: "antibadword",
    aliases: ["abw"],
    version: "1.2",
    author: "SiFu & Ebrahim",
    role: 1,
    shortDescription: "Warn bad words then kick user",
    longDescription: "Detects bad words and warns first, kicks on second offense",
    category: "group"
  },

  onEvent: async ({ event, api }) => {
    try {
      if (!event.isGroup || !event.body) return;

      const msg = event.body.toLowerCase();
      if (!badWords.some(word => msg.includes(word))) return;

      const { threadID, senderID } = event;
      const data = JSON.parse(fs.readFileSync(dataPath));

      if (!data[threadID]) data[threadID] = {};
      if (!data[threadID][senderID]) data[threadID][senderID] = 0;

      data[threadID][senderID] += 1;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

      const warnCount = data[threadID][senderID];

      // 🟡 First warning
      if (warnCount === 1) {
        await api.sendMessage(
          `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️\n\n@user\nআপনি অশ্লীল ভাষা ব্যবহার করেছেন ❌\n\nআর একবার করলে গ্রুপ থেকে বের করে দেওয়া হবে 👢`,
          threadID,
          null,
          { mentions: [{ id: senderID, tag: "@user" }] }
        );
        return;
      }

      // 🔴 Second time kick
      if (warnCount >= 2) {
        await api.sendMessage(
          `🚫 𝗞𝗜𝗖𝗞𝗘𝗗 🚫\n\n@user\nদুইবার অশ্লীল কথা বলার কারণে আপনাকে গ্রুপ থেকে বের করে দেওয়া হলো 😡`,
          threadID,
          null,
          { mentions: [{ id: senderID, tag: "@user" }] }
        );

        setTimeout(async () => {
          try {
            await api.removeUserFromGroup(senderID, threadID);
          } catch (err) {
            console.error("Kick error:", err);
          }
        }, 1500);
      }

    } catch (err) {
      console.error("AntiBadWord Error:", err);
    }
  }
};
