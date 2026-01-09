const { getTime, drive } = global.utils;
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

(async () => {
  try {
    const fontPath = path.join(__dirname, "cache", "english.ttf");
    if (!fs.existsSync(fontPath)) {
      const fontUrl = "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/main/english.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
    }
    registerFont(fontPath, { family: "ModernoirBold" });
  } catch (err) {
    console.error("❌ Font error:", err);
  }
})();

module.exports = {
  config: {
    name: "welcome",
    version: "2.5.0",
    author: "MAHBUB ULLASH & Gemini",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;
    const botID = api.getCurrentUserID();
    const authorID = event.author;

    // যদি বট নিজে জয়েন হয়
    if (dataAddedParticipants.some((item) => item.userFbId == botID)) {
      const { nickNameBot } = global.GoatBot.config;
      if (nickNameBot) api.changeNickname(nickNameBot, threadID, botID);
      
      const welcomeMsg = `╔════════════════════╗\n   ◇ 💠 আসসালামু আলাইকুম 💠 ◇\n╚════════════════════╝\n\nধন্যবাদ আমাকে এই গ্রুপে এড করার জন্য! ❤️\nআমার প্রিপিক্স: ${prefix}\nসাহায্যের জন্য লিখুন: ${prefix}help`;
      return api.sendMessage(welcomeMsg, threadID);
    }

    // নতুন মেম্বার জয়েন হলে
    try {
      const threadData = await threadsData.get(threadID);
      if (threadData?.settings?.sendWelcomeMessage === false) return;

      const threadInfo = await api.getThreadInfo(threadID);
      const threadName = threadInfo.threadName || "এই গ্রুপে";
      const memberCount = threadInfo.participantIDs.length;
      
      const addedByName = authorID ? (await usersData.getName(authorID)) : "সিস্টেম দ্বারা";

      for (const user of dataAddedParticipants) {
        const userName = user.fullName;
        const userID = user.userFbId;

        // ইমেজ তৈরির অংশ
        const backgrounds = [
          "https://files.catbox.moe/w1ieq5.jpg",
          "https://files.catbox.moe/c4aerh.jpg",
          "https://files.catbox.moe/mj7w5p.jpg"
        ];
        const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        const avatarUrl = `https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const canvas = createCanvas(1000, 500);
        const ctx = canvas.getContext("2d");

        try {
          const bgResponse = await axios.get(randomBg, { responseType: "arraybuffer" });
          const bg = await loadImage(bgResponse.data);
          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          let avatar;
          try {
            const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
            avatar = await loadImage(response.data);
          } catch {
            avatar = await loadImage("https://i.ibb.co/2kR9xgQ/default-avatar.png");
          }

          // গোল প্রোফাইল পিকচার
          ctx.save();
          ctx.beginPath();
          ctx.arc(500, 160, 110, 0, Math.PI * 2, true);
          ctx.lineWidth = 8;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(avatar, 390, 50, 220, 220);
          ctx.restore();

          // টেক্সট এরিয়া
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(50, 320, 900, 150);

          ctx.textAlign = "center";
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 45px ModernoirBold";
          ctx.fillText("WELCOME TO OUR GROUP", 500, 385);
          
          ctx.fillStyle = "#00FFCC";
          ctx.font = "bold 35px ModernoirBold";
          ctx.fillText(userName, 500, 440);

          const imgPath = path.join(__dirname, "cache", `welcome_${userID}.png`);
          fs.writeFileSync(imgPath, canvas.toBuffer());

          // আপনার দেওয়া ফরম্যাট অনুযায়ী মেসেজ
          const msgBody = `╔════════════════════╗
   ◇ 💠 আসসালামু আলাইকুম 💠 ◇
╚════════════════════╝

🖤 𝗗𝗘𝗔𝗥 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 ↓
➤ ${userName} 🌸

██████ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ██████

⬇️ 𝗧𝗢 →
🌸 ${threadName} 🌸

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

 ────꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────`;

          message.send({
            body: msgBody,
            attachment: fs.createReadStream(imgPath)
          }, () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          });

        } catch (imgErr) {
          // যদি কোনো কারণে ইমেজ লোড না হয়, শুধু টেক্সট পাঠাবে
          message.send(msgBody);
          console.error("Image Error:", imgErr);
        }
      }
    } catch (err) {
      console.error("Welcome Event Error:", err);
                   }
  }
};
