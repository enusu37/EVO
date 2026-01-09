const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "welcome",
    version: "4.0.0",
    author: "Ebrahim ❤️",
    category: "events"
  },

  onStart: async ({ api, event, usersData }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const addedUsers = event.logMessageData.addedParticipants;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "Group Chat";
      const memberCount = threadInfo.participantIDs.length;

      let addedBy = "Unknown";
      if (event.author) {
        try {
          addedBy = await usersData.getName(event.author);
        } catch {}
      }

      for (const user of addedUsers) {
        const userName = user.fullName || "New Member";
        const userID = user.userFbId;

        /* ===== IMAGE PART ===== */
        const canvas = createCanvas(900, 500);
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#0f0f0f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.textAlign = "center";
        ctx.fillStyle = "#00ffd5";
        ctx.font = "bold 36px Sans";
        ctx.fillText("ASSALAMU ALAIKUM", 450, 70);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px Sans";
        ctx.fillText(userName, 450, 130);

        ctx.fillStyle = "#ffcc00";
        ctx.font = "bold 26px Sans";
        ctx.fillText(`Welcome To ${groupName}`, 450, 180);

        ctx.fillStyle = "#00ff99";
        ctx.font = "bold 22px Sans";
        ctx.fillText(`You're the ${memberCount}th member`, 450, 230);

        ctx.fillStyle = "#ff6699";
        ctx.fillText(`Added By: ${addedBy}`, 450, 270);

        const imgPath = path.join(__dirname, "cache", `welcome_${userID}.png`);
        await fs.ensureDir(path.dirname(imgPath));
        await fs.writeFile(imgPath, canvas.toBuffer());

        /* ===== TEXT PART ===== */
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
➤ ${addedBy}

🌟 আশা করি আপনি এখানে অনেক মজা করবেন,
হাসবেন, আড্ডা দিবেন 🥰  
সবার সাথে মিলে সুন্দর বন্ধুত্ব গড়ে তুলবেন 💞

⚡ 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦 :
➤ সবার প্রতি সম্মান দেখাবেন 🤝  
➤ কোনো প্রকার অশ্লীলতা চলবে না 🚫  
➤ এডমিনের নির্দেশ মানতে হবে ✅

❤️ 𝗠𝗮𝗱𝗲 𝗕𝘆 : Ebrahim-❤️`;

        await api.sendMessage(
          {
            body: welcomeText,
            attachment: fs.createReadStream(imgPath)
          },
          threadID,
          () => fs.unlinkSync(imgPath)
        );
      }
    } catch (err) {
      console.error("❌ Welcome Error:", err);
    }
  }
};
