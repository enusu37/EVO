module.exports = {
  config: {
    name: "welcome",
    version: "3.0.0",
    author: "Ebrahim ❤️ (Modified by ChatGPT)",
    category: "events"
  },

  onStart: async ({ api, event, threadsData, usersData, message }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const addedUsers = event.logMessageData.addedParticipants;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "Unknown Group";
      const memberCount = threadInfo.participantIDs.length;

      let addedByName = "Unknown";
      if (event.author) {
        try {
          addedByName = await usersData.getName(event.author);
        } catch {
          addedByName = "Unknown User";
        }
      }

      for (const user of addedUsers) {
        const userName = user.fullName || "New Member";

        const welcomeText = 
`╔════════════════════╗
   ◇ 💠 আসসালামু আলাইকুম 💠 ◇
╚════════════════════╝

🖤 𝗗𝗘𝗔𝗥 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 ↓
➤ ${userName} 🌸

██████ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ██████

⬇️ 𝗧𝗢 →
☢️ ─꯭─⃝‌‌${groupName} ☢️

🎉 𝗬𝗢𝗨'𝗥𝗘 𝗧𝗛𝗘 『${memberCount}』𝗠𝗘𝗠𝗕𝗘𝗥  
𝗢𝗙 𝗧𝗛𝗜𝗦 𝗚𝗥𝗢𝗨𝗣 🎊

👤 𝗔𝗗𝗗𝗘𝗗 𝗕𝗬 ↓
➤ ${addedByName}

🌟 আশা করি আপনি এখানে অনেক মজা করবেন,
হাসবেন, আড্ডা দিবেন 🥰  
সবার সাথে মিলে সুন্দর বন্ধুত্ব গড়ে তুলবেন 💞

⚡ 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦 :
➤ সবার প্রতি সম্মান দেখাবেন 🤝  
➤ কোনো প্রকার অশ্লীলতা চলবে না 🚫  
➤ এডমিনের নির্দেশ মানতে হবে ✅

❤️ 𝗠𝗮𝗱𝗲 𝗕𝘆 : Ebrahim-❤️`;

        await api.sendMessage(welcomeText, threadID);
      }
    } catch (err) {
      console.error("❌ Welcome error:", err);
          }
  }
};
