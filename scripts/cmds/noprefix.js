  module.exports = {
  config: {
    name: "autoreply",
    version: "6.0.2",
    author: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
    countDown: 3,
    role: 0,
    shortDescription: "Auto-response bot",
    longDescription: "Auto-response bot with specified triggers",
    category: "No Prefix",
    guide: "{pn}",
  },

  // এই ফাংশনটি রান হবে যখন কেউ কমান্ড প্রিফিক্স দিয়ে কল করবে (যেমন: /autoreply)
  onStart: async function ({ api, event }) {
    return api.sendMessage("অটো রিপ্লাই সিস্টেম ব্যাকগ্রাউন্ডে চালু আছে।", event.threadID, event.messageID);
  },

  // এই ফাংশনটি চ্যাটের প্রতিটি মেসেজ চেক করবে (no prefix)
  onChat: async function ({ api, event }) {
    const { body, threadID, messageID } = event;
    if (!body) return;

    const msg = body.toLowerCase().trim();

    const responses = {
      "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস ইব্রাহিম রে হাঙ্গা করো😶👻😘",
      "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
      "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
      "help": "Prefix de sala",
      "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
      "bc": "SAME TO YOU😊",
      "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
      "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
      "tor ball": "~ এখনো বাল উঠে নাই নাকি তোমার?? 🤖",
      "ebrahim": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
      "owner": "‎[𝐎𝐖𝐍𝐄𝐑:☞ ebrahim ahamed☜\nFacebook: https://www.facebook.com/profile.php?id=100065568407761\nWhatsApp: +8801403299927",
      "admin": "He is 𝗘𝗯𝗿𝗮𝗵𝗶𝗺 𝗔𝗵𝗮𝗺𝗲𝗱 তাকে সবাই Cyber Bot Team Saport Admin হিসেবে চিনে😘☺️",
      "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
      "chup": "তুই চুপ চুপ কর পাগল ছাগল",
      "assalamu walaikum": "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ 💖",
      "fork": "https://github.com/shahadat-sahu/SHAHADAT-CHAT-BOT.git",
      "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
      "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস ইব্রাহিম রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
      "i love you": "মেয়ে হলে আমার বস ইব্রাহিম এর ইনবক্সে এখুনি গুঁতা দিন🫢😻",
      "bye": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️",
      "ami ebrahim": "হ্যা বস কেমন আছেন..?☺️",
      "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
      "tor nam ki": "MY NAME IS ─꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭💖",
      "pic de": "এন থেকে সর দুরে গিয়া মর😒",
      "cdi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
      "bal": "রাগ করে না সোনা পাখি 🥰",
      "heda": "এতো রাগ শরীরের জন্য ভালো না 🥰",
      "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
      "love you": "ভালোবাসা নামক আবলামী করতে চাইলে Boss ইব্রাহিম এর ইনবক্সে গুতা দিন 😘",
      "kire ki koros": "তোমার কথা ভাবতে ছি জানু",
      "kire": "হ্যাঁ সব কেমন আছেন 😘😽🙈",
      "আসসালামু আলাইকুম": "ওয়ালাইকুম আসসালাম জান 🥰",
      "tor boss ke": "আমার বস 𝗘𝗕𝗥𝗔𝗛𝗜𝗠 𝗔𝗛𝗔𝗠𝗘𝗔𝗗 সম্মান দিবি পাপির দল 👀🔪",
      "oi ki re": "মধু মধু রসমালাই 🤤",
      "🤖": "রোবট মোড অন 🤖",
      "mahabur": "𝐆𝐫𝐨𝐮𝐩 𝐞𝐫 𝐚𝐝𝐦𝐢𝐧 𝐬𝐨𝐛𝐚𝐢 𝐬𝐨𝐦𝐦𝐚𝐧 𝐝𝐢𝐛𝐢 😎",
    };

    if (responses[msg]) {
      return api.sendMessage(responses[msg], threadID, messageID);
    }
  }
};
