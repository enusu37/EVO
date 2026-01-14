const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "antiabuse",
    version: "3.0",
    author: "SiFu",
    countDown: 0,
    role: 0,
    shortDescription: "গালি দিলে ওয়ার্নিং ও কিক",
    longDescription: "অটোমেটিক গালি ডিটেকশন সিস্টেম",
    category: "system",
    guide: {
      en: "এটি অটোমেটিক চলবে"
    },
    // Priority সবথেকে বেশি রাখা হয়েছে যাতে অন্য কমান্ড বাধা না দেয়
    priority: 0 
  },

  onChat: async function ({ event, api, Threads }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (!body || senderID == api.getCurrentUserID()) return;

    // গালির লিস্ট (এখানে আপনার ইচ্ছামতো গালি বাড়াতে পারেন)
    const badWords = ["bal", "magi", "khanki", "sala", "baincod", "gali"];
    
    const input = body.toLowerCase();
    const isBadWord = badWords.some(word => input.includes(word));

    if (isBadWord) {
      try {
        // মেসেজটি ডিলিট করার চেষ্টা করবে (বট এডমিন হলে)
        api.unsendMessage(messageID);

        let threadData = await Threads.getData(threadID);
        if (!threadData.data) threadData.data = {};
        if (!threadData.data.warnList) threadData.data.warnList = {};
        if (!threadData.data.warnList[senderID]) threadData.data.warnList[senderID] = 0;

        threadData.data.warnList[senderID]++;

        if (threadData.data.warnList[senderID] === 1) {
          // ১ম বার ওয়ার্নিং
          return api.sendMessage({
            body: `🎀 𝐖𝐚𝐫𝐧𝐢𝐧𝐠 𝟏/𝟐\n━━━━━━━━━━━━━━━━\n❌ 𝐀𝐛𝐮𝐬𝐢𝐯𝐞 𝐋𝐚𝐧𝐠𝐮𝐚𝐠𝐞 𝐃𝐞𝐭𝐞𝐜𝐭𝐞𝐝!\n🎀 𝐍𝐚𝐦𝐞: ${senderID}\n⚠️ গালি দেওয়া নিষেধ। এরপর আবার দিলে গ্রুপ থেকে বের করে দেওয়া হবে।`
          }, threadID);
        } 
        else if (threadData.data.warnList[senderID] >= 2) {
          // ২য় বার কিক
          api.sendMessage(`🎀 𝐒𝐞𝐜𝐨𝐧𝐝 𝐖𝐚𝐫𝐧𝐢𝐧𝐠!\n❌ কথা শোনেননি, তাই আপনাকে গ্রুপ থেকে রিমুভ করা হলো।`, threadID, () => {
            api.removeUserFromGroup(senderID, threadID, (err) => {
              if (err) return api.sendMessage("❌ বোটকে এডমিন করুন নতুবা কিক দেওয়া সম্ভব না!", threadID);
            });
            // কিক মারার পর কাউন্ট রিসেট
            threadData.data.warnList[senderID] = 0;
          });
        }
        
        await Threads.setData(threadID, { data: threadData.data });
      } catch (err) {
        console.error(err);
      }
    }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage("🎀 Anti-Abuse System Active! এটি এখন গালি দিলে অটো অ্যাকশন নিবে।", event.threadID);
  }
};
