const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "antibadwordData.json");
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));
}

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
    version: "1.3",
    author: "SiFu",
    countDown: 0,
    role: 1,
    shortDescription: "Anti bad word system",
    longDescription: "Warn first time, kick second time",
    category: "group",
    guide: {
      en: "Auto detect bad words in group"
    }
  },

  // ✅ MUST HAVE (না থাকলে install error দিবে)
  onStart: async () => {},

  onEvent: async ({ event, api }) => {
    try {
      if (!event.isGroup || !event.body) return;

      const text = event.body.toLowerCase();
      if (!badWords.some(w => text.includes(w))) return;

      const { threadID, senderID } = event;
      const data = JSON.parse(fs.readFileSync(dataPath));

      if (!data[threadID]) data[threadID] = {};
      if (!data[threadID][senderID]) data[threadID][senderID] = 0;

      data[threadID][senderID]++;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

      const warn = data[threadID][senderID];

      // 🟡 First warning
      if (warn === 1) {
        await api.sendMessage(
          `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ⚠️\n\n@user\nগালাগালি / অশ্লীল কথা বলা নিষেধ ❌\n\nআর একবার করলে গ্রুপ থেকে বের করে দেওয়া হবে 👢`,
          threadID,
          null,
          { mentions: [{ id: senderID, tag: "@user" }] }
        );
        return;
      }

      // 🔴 Second time kick
      if (warn >= 2) {
        await api.sendMessage(
          `🚫 𝗞𝗜𝗖𝗞𝗘𝗗 🚫\n\n@user\nবারবার গালাগালি করার কারণে আপনাকে গ্রুপ থেকে বের করে দেওয়া হলো 😡`,
          threadID,
          null,
          { mentions: [{ id: senderID, tag: "@user" }] }
        );

        setTimeout(() => {
          api.removeUserFromGroup(senderID, threadID)
            .catch(err => console.error("Kick error:", err));
        }, 1500);
      }

    } catch (err) {
      console.error("AntiBadWord Error:", err);
    }
  }
};
