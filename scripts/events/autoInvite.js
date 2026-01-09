module.exports = {
  config: {
    name: "autoinvite",
    version: "2.5",
    author: "Mohammad Akash (Modified by ChatGPT)",
    category: "events"
  },

  onStart: async ({ api, event, usersData, message }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData, author } = event;
    const leftID = logMessageData.leftParticipantFbId;

    const name = await usersData.getName(leftID);

    const footer = `
━━━━━━━━━━━━━━━
👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 : 𝐄𝐛𝐫𝐚𝐡𝐢𝐦 💎
━━━━━━━━━━━━━━━`;

    // 🟢 যদি ইউজার নিজে লিভ নেয়
    if (leftID === author) {
      try {
        await api.addUserToGroup(leftID, threadID);

        await message.send({
          body: `শোন, ${name}, এই গ্রুপ হইলো গ্যাং!
এখান থেকে যাইতে হলে এডমিনের পারমিশন লাগে!
তুই পারমিশন ছাড়া লিভ নিছোস – তোকে আবার মাফিয়া স্টাইলে এড দিলাম 😎🔥
${footer}`
        });

      } catch (e) {
        await message.send({
          body: `সরি বস 😔
${name} কে আবার এড করতে পারলাম না।
সম্ভবত উনি বটকে ব্লক করেছে অথবা তার প্রাইভেসি সেটিংসের কারণে এড করা যায় না।
${footer}`
        });
      }
      return;
    }

    // 🔴 যদি কোনো মেম্বারকে kick করা হয় (admin দ্বারা)
    if (leftID !== author) {
      // যদি এডমিন কাউকে রিমুভ করে
      if (logMessageData?.kickerFbId) {
        await message.send({
          body: `তোমার এই গ্রুপে থাকার কোনো যোগ্যাতা নেই ছাগল 😡
তাই তোমাকে লাথি মেরে গ্রুপ থেকে বের করে দেওয়া হলো 🤪
WELLCOME REMOVE 🤧
${footer}`
        });
      } 
      // যদি সাধারণ মেম্বার লিভ নেয় (rare case)
      else {
        await message.send({
          body: `তোর সাহস কম না 😡😠
গ্রুপের এডমিনের পারমিশন ছাড়া তুই লিভ নিস!
${footer}`
        });
      }
    }
  }
};
