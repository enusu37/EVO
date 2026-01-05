const { getTime } = global.utils;

const roastList = [
  "তোর এই গ্রুপে থাকার কোনো যোগ্যতা নেই ছাগল 😡",
  "ছাগল, এই গ্রুপের জন্য তুমি তৈরি নও 🤪",
  "😂 এই গ্রুপের নিয়ম ভাঙলে চলে না, ছাগল!",
  "তোর মতোদের আমি দেখেই হেসে ফেলি 😹",
  "🤧 WELLCOME REMOVE, ছাগল!"
];

// GIF/ছবি URL list (random pick)
const gifList = [
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif",
  "https://media.giphy.com/media/3o7TKP9WxPzM1J8fLu/giphy.gif",
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
];

function getRandomRoast() {
  return roastList[Math.floor(Math.random() * roastList.length)];
}

function getRandomGif() {
  return gifList[Math.floor(Math.random() * gifList.length)];
}

module.exports = {
  config: {
    name: "autoinvite",
    version: "5.0",
    author: "Mohammad Akash | Modified by ALVI-BOSS",
    category: "events"
  },

  onStart: async function () {},

  onEvent: async function ({ api, event, usersData, message }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData, author } = event;
    const leftID = logMessageData.leftParticipantFbId;

    // ================================
    // CASE 1: কেউ কাউকে CLICK দিয়ে KICK করেছে
    // ================================
    if (leftID !== author) {
      let userName = "এই ছাগল 🐐";
      let kickerName = "অ্যাডমিন 👑";
      try {
        userName = await usersData.getName(leftID);
        kickerName = await usersData.getName(author);
      } catch {}

      const roast = getRandomRoast();
      const gif = getRandomGif();

      return api.sendMessage(
        {
          body: `⚠️ @${userName.replace(/\s+/g,"")} কে ${kickerName} গ্রুপ থেকে লাথি মেরে বের করলো! 🤪\n\n${roast}`,
          attachment: require("fs").createReadStream(await downloadGif(gif)),
          mentions: [{ id: leftID, tag: userName }, { id: author, tag: kickerName }]
        },
        threadID,
        () => api.setMessageReaction("💥", event.messageID, () => {}, true)
      );
    }

    // ================================
    // CASE 2: কেউ নিজে নিজে LEAVE নিয়েছে
    // ================================
    if (leftID === author) {
      const userName = await usersData.getName(leftID);

      const boldMap = {
        A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",
        K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",
        U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",
        a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",
        k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",
        u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇"
      };

      const boldName = userName.split("").map(c => boldMap[c] || c).join("");

      const form = {
        body: `🛑 এই বলদ....!! 😹  
${boldName}  
💬 গ্রুপ থেকে লিভ নেওয়া কি মুখের কথা নাকি? 😏  
👑 যে গ্রুপে আমি থাকি..?? 🐸  
⚠️ সেই গ্রুপ থেকে লিভ নেওয়া অসম্ভব ভাই! 😂  
🌀 আবার অ্যাড করে দিলাম 😇  

━━━━━━━━━━━━━━━
👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 : ইব্রাহিম 💎
━━━━━━━━━━━━━━━`
      };

      try {
        await api.addUserToGroup(leftID, threadID);
        await message.send(form);
      } catch {
        message.send("⚠️ দুঃখিত, আমি ইউজারটাকে আবার অ্যাড করতে পারিনি। সম্ভবত অ্যাড ব্লক করা আছে।");
      }
    }
  }
};

// Helper function to download GIF locally for Messenger
const fs = require("fs");
const axios = require("axios");
const path = require("path");

async function downloadGif(url) {
  const fileName = path.join(__dirname, "temp.gif");
  const writer = fs.createWriteStream(fileName);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(fileName));
    writer.on("error", reject);
  });
    }
