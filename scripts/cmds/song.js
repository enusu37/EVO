const axios = require("axios");

module.exports = {
  config: {
    name: "song",
    aliases: ["music", "sing"],
    version: "2.0",
    author: "MAHBUB ULLASH",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Download and play songs from YouTube" },
    longDescription: { en: "Search for a song and get the audio file directly in chat." },
    category: "media",
    guide: { en: "{p}song <song name>" }
  },

  onStart: async function ({ message, event, args, api }) {
    const { threadID, messageID } = event;
    const songName = args.join(" ");

    // গান এর নাম না দিলে রিপ্লাই দিবে
    if (!songName) {
      return message.reply("❌ অনুগ্রহ করে একটি গানের নাম লিখুন। যেমন: {p}song pal pal");
    }

    try {
      // প্রথম মেসেজ (সার্চিং অবস্থা)
      const waitingMsg = await message.reply(`🔍 "${songName}"!\nঅনগ্রহ করে একটু সময় অপেক্ষা করুন\nধন্যবাদ 😉`);

      // YouTube API থেকে তথ্য খোঁজা (এখানে একটি পাবলিক API ব্যবহার করা হয়েছে)
      // নোট: API কাজ না করলে অন্য সোর্স ব্যবহার করতে হবে
      const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`);
      // দ্রষ্টব্য: এখানে আমি একটি ডামি লজিক দিচ্ছি, কারণ ইউটিউব ডাউনলোডার এর জন্য নির্দিষ্ট API প্রয়োজন হয়।
      
      // নিচের অংশটি মূলত মিউজিক ভিডিওর টাইটেল ও থাম্বনেইল দেখানোর জন্য
      const searchRes = await axios.get(`https://joshweb.click/search/yt?q=${encodeURIComponent(songName)}`);
      const videoData = searchRes.data.result[0];

      if (!videoData) {
        return message.reply("❌ দুঃখিত, গানটি খুঁজে পাওয়া যায়নি।");
      }

      const { title, thumbnail, url } = videoData;

      // দ্বিতীয় মেসেজ (লোডিং অবস্থা)
      const loadingText = `🎶 Title: ${title}\n⌛ একটু অপেক্ষা করো Song load হচ্ছে 😘`;
      
      // থাম্বনেইল সহ মেসেজ পাঠানো
      await api.sendMessage({
        body: loadingText,
        attachment: await global.utils.getStreamFromURL(thumbnail)
      }, threadID);

      // গান ডাউনলোড এবং পাঠানোর প্রক্রিয়া (অডিও)
      const downloadRes = await axios.get(`https://joshweb.click/api/ytaudio?url=${encodeURIComponent(url)}`);
      const audioUrl = downloadRes.data.result.download_url;

      return api.sendMessage({
        body: `✅ এখানে আপনার গান: ${title}`,
        attachment: await global.utils.getStreamFromURL(audioUrl)
      }, threadID, messageID);

    } catch (err) {
      console.error(err);
      return message.reply("⚠️ গানটি লোড করার সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
    }
  }
};
