const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "welcome",
    version: "5.0.0",
    author: "Ebrahim ❤️",
    category: "events"
  },

  onStart: async ({ api, event, usersData }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const users = event.logMessageData.addedParticipants;

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

      for (const u of users) {
        const name = u.fullName || "New Member";
        const uid = u.userFbId;

        /* ===== CANVAS ===== */
        const canvas = createCanvas(1000, 500);
        const ctx = canvas.getContext("2d");

        // Background
        const bg = await loadImage("https://files.catbox.moe/w1ieq5.jpg");
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // Dark overlay
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Avatar
        let avatar;
        try {
          const av = await axios.get(
            `https://graph.facebook.com/${uid}/picture?height=512&width=512`,
            { responseType: "arraybuffer" }
          );
          avatar = await loadImage(av.data);
        } catch {
          avatar = await loadImage("https://i.ibb.co/2kR9xgQ/default-avatar.png");
        }

        const x = 410, y = 60, r = 90;
        ctx.save();
        ctx.beginPath();
        ctx.arc(500, y + r, r, 0, Math.PI * 2);
        ctx.shadowColor = "#00ffd5";
        ctx.shadowBlur = 25;
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, y, r * 2, r * 2);
        ctx.restore();

        // Text
        ctx.textAlign = "center";
        ctx.fillStyle = "#00ffd5";
        ctx.font = "bold 40px Sans";
        ctx.fillText("ASSALAMU ALAIKUM", 500, 280);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px Sans";
        ctx.fillText(name, 500, 330);

        ctx.fillStyle = "#ffcc00";
        ctx.font = "bold 26px Sans";
        ctx.fillText(`Welcome to ${groupName}`, 500, 380);

        ctx.fillStyle = "#00ff99";
        ctx.font = "bold 22px Sans";
        ctx.fillText(`You're the ${memberCount}th member`, 500, 420);

        const imgPath = path.join(__dirname, "cache", `welcome_${uid}.png`);
        await fs.ensureDir(path.dirname(imgPath));
        await fs.writeFile(imgPath, canvas.toBuffer());

        /* ===== TEXT ===== */
        const text =
`╔════════════════════╗
◇ 💠 আসসালামু আলাইকুম 💠 ◇
╚════════════════════╝

🖤 𝗗𝗘𝗔𝗥 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥
➤ ${name} 🌸

██████ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ██████
☢️ ${groupName} ☢️

🎉 আপনি এই গ্রুপের 『${memberCount}』 নাম্বার মেম্বার 🎊

👤 𝗔𝗗𝗗𝗘𝗗 𝗕𝗬
➤ ${addedBy}

⚡ 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦
✔ সবার প্রতি সম্মান  
✔ অশ্লীলতা নিষেধ  
✔ এডমিনের কথা মানতে হবে  

❤️ 𝗠𝗮𝗱𝗲 𝗕𝘆 : Ebrahim-❤️`;

        await api.sendMessage(
          { body: text, attachment: fs.createReadStream(imgPath) },
          threadID,
          () => fs.unlinkSync(imgPath)
        );
      }
    } catch (e) {
      console.log("❌ Welcome Error:", e);
    }
  }
};
