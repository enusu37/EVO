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
      console.log("u");
      const fontUrl = "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/main/english.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
      console.log("l");
    }
    registerFont(fontPath, { family: "ModernoirBold" });
    console.log("l");
  } catch (err) {
    console.error("❌ Font a s h error:", err);
  }
})();

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return y;
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y;
}

const WELCOME_GIF_URL = "https://files.catbox.moe/38guc2.gif";

async function sendWelcomeGifMessage(api, threadID, bodyText) {
  try {
    const gifPath = path.join(__dirname, "cache", "welcome_bot.gif");

    if (!fs.existsSync(gifPath)) {
      const { data } = await axios.get(WELCOME_GIF_URL, { responseType: "arraybuffer" });
      await fs.outputFile(gifPath, data);
    }

    await api.sendMessage(
      {
        body: bodyText,
        attachment: fs.createReadStream(gifPath)
      },
      threadID
    );
  } catch (err) {
    console.error("Failed to send welcome gif message:", err);
    try {
      await api.sendMessage(bodyText, threadID);
    } catch (e) {
      console.error("Failed to send fallback welcome message:", e);
    }
  }
}

module.exports = {
  config: {
    name: "welcome",
    version: "2.0.0",
    author: "MAHBUB ULLASH",
    category: "events"
  },

  langs: {
    vi: {
      session1: "sáng",
      session2: "trưa",
      session3: "chiều",
      session4: "tối",
      welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
      multiple1: "bạn",
      multiple2: "các bạn",
      defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
    },
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      welcomeMessage: "Thank you for inviting me to the group!\nBot prefix: %1\nTo view the list of commands, please enter: %1help",
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage: `Hello {userName}.\nWelcome {multiple} to the chat group: {boxName}\nHave a nice {session} 😊`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang, usersData }) => {
    if (event.logMessageType == "log:subscribe")
      return async function () {
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;
        const botID = api.getCurrentUserID();

        if (dataAddedParticipants.some((item) => item.userFbId == botID)) {
          if (nickNameBot)
            api.changeNickname(nickNameBot, threadID, botID);

          const { threadApproval } = global.GoatBot.config;
          if (threadApproval && threadApproval.enable) {
            try {
              const isAutoApprovedThread = threadApproval.autoApprovedThreads && threadApproval.autoApprovedThreads.includes(threadID);

              if (isAutoApprovedThread) {
                await threadsData.set(threadID, { approved: true });
                console.log(`Auto-approved thread ${threadID} from autoApprovedThreads list`);

                setTimeout(async () => {
                  try {
                    const text = getLang("welcomeMessage", prefix);
                    await sendWelcomeGifMessage(api, threadID, text);
                  } catch (err) {
                    console.error(`Failed to send welcome message to auto-approved thread ${threadID}:`, err.message);
                  }
                }, 2000);
                return null;
              }

              await threadsData.set(threadID, { approved: false });

              if (threadApproval.adminNotificationThreads && threadApproval.adminNotificationThreads.length > 0 && threadApproval.sendNotifications !== false) {
                setTimeout(async () => {
                  try {
                    let threadInfo = { threadName: "Unknown", participantIDs: [] };
