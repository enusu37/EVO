const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const res = await axios.get(
    "https://bank-game-api.cyberbot.top";
  );
  return res.data.api;
};

module.exports = {
  config: {
    name: "song",
    version: "2.5.0",
    author: "RX api x GoatBot",
    role: 0,
    category: "media",
    shortDescription: "Search & download audio from YouTube",
    longDescription: "Search YouTube and download audio (MP3 format) with interactive selection.",
    guide: "{pn} [song name | YouTube link]"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) 
      return api.sendMessage("❌ Please provide a song name or YouTube link.", event.threadID, event.messageID);

    // প্রথম সার্চ মেসেজ
    const searchingMsg = await api.sendMessage(
      `🔍 Searching for: "${query}"\nঅল্প সময় অপেক্ষা করুন... 😉`,
      event.threadID,
      event.messageID
    );

    try {
      const res = await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(query)}`);
      const results = res.data.slice(0, 6);

      if (!results.length) {
        api.unsendMessage(searchingMsg.messageID);
        return api.sendMessage(`⭕ No results found for: "${query}"`, event.threadID, event.messageID);
      }

      // রেজাল্ট লিস্ট তৈরি
      let msg = "🎧 Select a song (reply with 1–6):\n\n";
      const thumbs = [];

      results.forEach((song, i) => {
        msg += `${i + 1}. ${song.title}\n⏱️ ${song.time}\n\n`;
        thumbs.push(loadStream(song.thumbnail));
      });

      const attachments = (await Promise.all(thumbs)).filter(Boolean);

      api.sendMessage(
        { body: msg + "🎶 Reply with the number to download.", attachment: attachments },
        event.threadID,
        (err, sentMsg) => {
          global.GoatBot.onReply.set(sentMsg.messageID, {
            commandName: "song",
            author: event.senderID,
            results
          });
          api.unsendMessage(searchingMsg.messageID);
        },
        event.messageID
      );

    } catch (err) {
      api.unsendMessage(searchingMsg.messageID);
      api.sendMessage("❌ Error searching for songs. Please try again.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const { results } = Reply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > results.length)
      return api.sendMessage("❌ Invalid choice! Reply with a number from the list.", event.threadID, event.messageID);

    const selected = results[choice - 1];
    api.unsendMessage(event.messageReply.messageID);

    // লোডিং মেসেজ
    const loadingMsg = `🎶 Preparing: ${selected.title}\n⏳ Please wait, song is loading... 😘`;
    const loadingThumb = await loadStream(selected.thumbnail);

    const loadInfo = await api.sendMessage({ body: loadingMsg, attachment: loadingThumb }, event.threadID, event.messageID);

    try {
      const { data } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${selected.id}&format=mp3`);
      const tmpDir = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `${Date.now()}.mp3`);
      const songRes = await axios.get(data.downloadLink, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(songRes.data));

      api.sendMessage(
        { body: `✅ Now Playing: ${data.title}`, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
          api.unsendMessage(loadInfo.messageID);
        },
        event.messageID
      );

    } catch (err) {
      api.sendMessage("⭕ Error downloading audio. Please try again.", event.threadID, event.messageID);
      api.unsendMessage(loadInfo.messageID);
    }
  }
};

async function loadStream(url) {
  try {
    const res = await axios.get(url, { responseType: "stream" });
    return res.data;
  } catch {
    return null;
  }
}
