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
    version: "1.1",
    author: "SiFu",
    role: 1,
    shortDescription: "Auto bad word detect",
    longDescription: "Warn first time, kick second time",
    category: "group"
  },

  onStart: async () => {},

  onEvent: async ({ event, api }) => {
    try {
      if (!event.body || !event.isGroup) return;

      const msg = event.body.toLowerCase();
      if (!badWords.some(w => msg.includes(w))) return;

      const data = JSON.parse(fs.readFileSync(dataPath));
      const { threadID, senderID } = event;

      if (!data[threadID]) data[threadID] = {};
      if (!data[threadID][senderID]) data[threadID][senderID] = 0;

      data[threadID][senderID]++;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

      // 🟡 First warning
      if (data[threadID][senderID] === 1) {
        return api.sendMessage(
          `⚠️ WARNING ⚠️\n\n@user\nগালাগালি করা নিষিদ্ধ ❌\nআর একবার করলে kick করা হবে 🚫`,
          threadID,
          null,
          { mentions: [{ id: senderID, tag: "@user" }] }
        );
      }

      // 🔴 Second time kick
      if (data[threadID][senderID] >= 2) {
        await api.sendMessage(
          `🚫 KICKED 🚫\n\n@user\nবারবার গালাগালি করার জন্য গ্রুপ থেকে বের করে দেওয়া হলো 👢`,
          threadID,
          null,
          { mentions: [{ id: senderID, tag: "@user" }] }
        );

        await api.removeUserFromGroup(senderID, threadID);
      }

    } catch (e) {
      console.error(e);
    }
  }
};
