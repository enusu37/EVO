const { getTime, drive } = global.utils;
const { nickNameBot } = global.GoatBot.config;

module.exports = {
  config: {
    name: "welcome",
    version: "3.0",
    author: "ALVI-BOSS",
    category: "events"
  },

  langs: {
    en: {
      defaultWelcomeMessage:
`╔════════════════════╗
   ◇ 💠 আসসালামু আলাইকুম 💠 ◇
╚════════════════════╝

🖤 𝗗𝗘𝗔𝗥 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 ↓
➤ {userName} 🌸

██████ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ██████

⬇️ 𝗧𝗢 →
☢️ {threadName} ☢️

🎉 𝗬𝗢𝗨'𝗥𝗘 𝗧𝗛𝗘 『{memberCount}』𝗠𝗘𝗠𝗕𝗘𝗥  
𝗢𝗙 𝗧𝗛𝗜𝗦 𝗚𝗥𝗢𝗨𝗣 🎊

👤 𝗔𝗗𝗗𝗘𝗗 𝗕𝗬 ↓
➤ {inviterName}

🌟 আশা করি আপনি এখানে অনেক মজা করবেন,
হাসবেন, আড্ডা দিবেন 🥰  
সবার সাথে মিলে সুন্দর বন্ধুত্ব গড়ে তুলবেন 💞

⚡ 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦 :
➤ সবার প্রতি সম্মান দেখাবেন 🤝  
➤ কোনো প্রকার অশ্লীলতা চলবে না 🚫  
➤ এডমিনের নির্দেশ মানতে হবে ✅

❤️ 𝗠𝗮𝗱𝗲 𝗕𝘆 : Ebrahim-𝗕𝗼𝘀𝘀 ❤️
`,
      botAddedMessage:
`🤖 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 𝗔𝗖𝗧𝗜𝗩𝗘 ✅

⚙️ Prefix : /
📜 Type /help for commands

🔥 Let's rule the group together 🔥
— ALVI-BOSS`
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendWelcomeMessage) return;

    const addedMembers = event.logMessageData.addedParticipants;
    const threadName = threadData.threadName;

    for (const user of addedMembers) {
      const userID = user.userFbId;
      const botID = api.getCurrentUserID();

      // Bot added
      if (userID == botID) {
        if (nickNameBot)
          await api.changeNickname(nickNameBot, threadID, botID);
        return message.send(getLang("botAddedMessage"));
      }

      const userName = user.fullName;
      const inviterName = await usersData.getName(event.author);
      const memberCount = event.participantIDs.length;

      let welcomeMessage = getLang("defaultWelcomeMessage")
        .replace(/\{userName\}/g, userName)
        .replace(/\{threadName\}/g, threadName)
        .replace(/\{memberCount\}/g, memberCount)
        .replace(/\{inviterName\}/g, inviterName);

      const form = {
        body: welcomeMessage,
        mentions: [{ tag: userName, id: userID }]
      };

      // Attachment support
      if (threadData.data.welcomeAttachment) {
        const files = threadData.data.welcomeAttachment;
        const attachments = files.map(file =>
          drive.getFile(file, "stream")
        );
        form.attachment = (await Promise.allSettled(attachments))
          .filter(i => i.status === "fulfilled")
          .map(i => i.value);
      }

      message.send(form);
    }
  }
};
