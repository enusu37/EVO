module.exports = {
  config: {
    name: "autoInvite",
    eventType: ["log:unsubscribe"],
    version: "2.0.0",
    author: "CYBER ☢️_𖣘 -BOT ⚠️ TEAM_ ☢️",
    description: "Anti-out + Leave notification (Auto re-add with message & gif)",
    dependencies: {
      "fs-extra": "",
      "path": ""
    }
  },

  run: async function ({ api, event, Users, Threads }) {
    try {
      // 🔹 Bot নিজে লিভ করলে কিছু করবে না
      if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

      const fs = global.nodemodule["fs-extra"];
      const path = global.nodemodule["path"];

      const threadID = event.threadID;
      const leftID = event.logMessageData.leftParticipantFbId;

      // 🔹 Thread data
      const threadData =
        global.data.threadData.get(threadID) ||
        (await Threads.getData(threadID)).data ||
        {};

      // 🔹 Antiout off থাকলে শুধু leave message
      const antiout = threadData.antiout !== false;

      // 🔹 User name
      const name =
        global.data.userName.get(leftID) ||
        (await Users.getNameUser(leftID));

      // 🔹 Leave type
      const isSelfLeave = event.author == leftID;

      const typeText = isSelfLeave
        ? "তোর সাহস কম না 😡 এডমিনের পারমিশন ছাড়া গ্রুপ লিভ নিছোস!"
        : "তোমার এই গ্রুপে থাকার যোগ্যতা নাই 🤬 তাই লাথি মেরে বের করে দেওয়া হইছে 🤪";

      // 🔹 Leave message
      let msg =
        typeof threadData.customLeave === "string"
          ? threadData.customLeave
          : `ইস {name} 😢\n{type}\n\n✦───꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭───✦`;

      msg = msg.replace(/{name}/g, name).replace(/{type}/g, typeText);

      // 🔹 Gif setup
      const gifDir = path.join(__dirname, "Shahadat", "leaveGif");
      const gifPath = path.join(gifDir, "leave1.gif");

      if (!fs.existsSync(gifDir)) fs.mkdirSync(gifDir, { recursive: true });

      const formMessage = fs.existsSync(gifPath)
        ? { body: msg, attachment: fs.createReadStream(gifPath) }
        : { body: msg };

      // 🔹 Send leave message
      api.sendMessage(formMessage, threadID);

      // 🔹 Anti-out logic (শুধু self leave হলে)
      if (!antiout || !isSelfLeave) return;

      api.addUserToGroup(leftID, threadID, (err) => {
        if (err) {
          return api.sendMessage(
            `সরি বস 😔\n${name} কে আবার এড করা যায়নি।\nসম্ভবত উনি বটকে ব্লক করেছে অথবা প্রাইভেসি সেটিংসের কারণে এড করা যাচ্ছে না।\n\n────꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────`,
            threadID
          );
        }

        api.sendMessage(
          `শোন ${name} 😏\nএই গ্রুপ হইলো গ্যাং 🔥\nএডমিনের পারমিশন ছাড়া লিভ নেওয়া যায় না!\nতাই তোকে আবার মাফিয়া স্টাইলে এড দিলাম 😎\n\n────꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────`,
          threadID
        );
      });
    } catch (e) {
      console.error("❌ autoInvite error:", e);
  }
  }
};
