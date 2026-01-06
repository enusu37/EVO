module.exports = {
  config: {
    name: "autoreplybot",
    version: "7.0",
    author: "Shahadat Islam",
    role: 0,
    category: "events",
    shortDescription: {
      en: "Auto reply system"
    },
    longDescription: {
      en: "Auto-response bot with specified triggers without prefix"
    },
    cooldown: 3
  },

  handleEvent: async function ({ api, event, Users }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    const name = await Users.getNameUser(senderID);
    const msg = body.toLowerCase().trim();

    const responses = {
      "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস ইব্রাহিম রে হাঙ্গা করো😶👻😘",
      "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
      "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
      "help": "Prefix de sala",
      "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
      "bc": "SAME TO YOU😊",
      "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
      "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
      "tor ball": "~ এখনো বাল উঠে নাই নাকি তোমার?? 🤖",
      "ebrahim": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
      "owner": "‎[𝐎𝐖𝐍𝐄𝐑:☞ ebrahim ahamed☜]",
      "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস ইব্রাহিম রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
      "i love you": "মেয়ে হলে আমার বস ইব্রাহিম এর ইনবক্সে এখুনি গুঁতা দিন🫢😻",
      "bye": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️",
      "😀": "এই যে দাঁত বের করে হাসছিস কেনো? 😁",
      "🙂": "কিরে এত ছেনটি খান কেনো 🤔",
      "😘": "আয় একখান রিটার্ন কিস্সস্স 😘",
      "kire": "হ্যাঁ সব কেমন আছেন 😘😽🙈"
    };

    if (responses[msg]) {
      return api.sendMessage(responses[msg], threadID, messageID);
    }
  },

  onStart: async function () {
    // GoatBot v2 event command – direct run দরকার হয় না
  }
};
