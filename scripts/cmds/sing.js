const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "sing",
    aliases: ["song", "music", "audio"],
    version: "1.0",
    author: "Gemini | Modified by MAHBUB ULLASH",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Download & play song"
    },
    longDescription: {
      en: "Search YouTube and download song audio with thumbnail"
    },
    category: "media",
    guide: {
      en: "{p}sing <song name>"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    const { threadID, messageID } = event;
    const songName = args.join(" ");

    if (!songName) {
      return message.reply(
        "❌ গানটির নাম লিখো 😊\nউদাহরণ: sing pal pal"
      );
    }

    try {
      // 🔍 Searching message
      await message.reply(
        `🔍 "${songName}" খোঁজা হচ্ছে...\nএকটু অপেক্ষা করো 🎧`
      );

      // 🔎 YouTube search
      const searchRes = await axios.get(
        `https://joshweb.click/search/yt?q=${encodeURIComponent(songName)}`
      );

      const video = searchRes.data?.result?.[0];
      if (!video) {
        return message.reply("❌ কোনো গান খুঁজে পাওয়া যায়নি 😔");
      }

      const { title, thumbnail, url } = video;

      // 🎶 Loading message with thumbnail
      await api.sendMessage(
        {
          body: `🎵 Title: ${title}\n⏳ Song প্রস্তুত হচ্ছে...`,
          attachment: await global.utils.getStreamFromURL(thumbnail)
        },
        threadID
      );

      // 🎧 Audio download
      const downloadRes = await axios.get(
        `https://joshweb.click/api/ytaudio?url=${encodeURIComponent(url)}`
      );

      const audioUrl = downloadRes.data?.result?.download_url;
      if (!audioUrl) {
        return message.reply("⚠️ এই গানটি ডাউনলোড করা যাচ্ছে না।");
      }

      // ✅ Send audio
      return api.sendMessage(
        {
          body: `🎶 Now Playing:\n${title}`,
          attachment: await global.utils.getStreamFromURL(audioUrl)
        },
        threadID,
        messageID
      );

    } catch (error) {
      console.error(error);
      return message.reply(
        "⚠️ সার্ভার সমস্যা 😢\nপরে আবার চেষ্টা করো।"
      );
    }
  }
};
