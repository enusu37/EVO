const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autoreplybot",
  version: "6.1.0",
  hasPermission: 0,
  credits: "ALVI",
  description: "No prefix auto reply chat bot",
  commandCategory: "No Prefix",
  usages: "Auto Reply",
  cooldowns: 3
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const { threadID, messageID, senderID, body } = event;

    // ignore empty msg & bot itself
    if (!body || senderID === api.getCurrentUserID()) return;

    const msg = body.toLowerCase().trim();

    const responses = {
      "miss you": "অরে বেডারে Miss না করে xan 😶👻😘",
      "kiss de": "কিস দিস না, আগে দাঁত ব্রাশ কর 🤬",
      "👍": "সর এখান থেকে লাইকার আবাল..! 🐸🤣👍",
      "help": "Prefix দে সালা 😏",
      "hi": "এত হাই-হ্যালো করিস কেন প্রিও..! 😜",
      "bc": "SAME TO YOU 😊",
      "pro": "Khud ko kya legend samajhta hai 😂",
      "good morning": "GOOD MORNING 🌞 দাঁত ব্রাশ করছিস তো?",
      "tor ball": "এখনো বাল উঠে নাই নাকি? 🤖",
      "ebrahim": "ইব্রাহিম বস এখন বিজি, কি বলবা বলেন 😘",
      "owner": "OWNER: Shahadat Islam\nFB: facebook.com/profile.php?id=100065568407761\nWhatsApp: +8801403299927",
      "admin": "তিনি ইব্রাহিম আহামেদ — Cyber Bot Team Support Admin 😘",
      "babi": "এ তো হাসিনা হে, মেরে দিলকি ধড়কন 😍",
      "chup": "তুই চুপ কর পাগল ছাগল 🤡",
      "assalamu alaikum": "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ 💖",
      "fork": "https://github.com/shahadat-sahu/SHAHADAT-CHAT-BOT.git",
      "kiss me": "তুই পঁচা 🤭 কিস দিবো না",
      "thanks": "ধন্যবাদ না দিয়ে বস ইব্রাহিমকে মনে রাখ 😎",
      "i love you": "মেয়ে হলে বস ইব্রাহিমের ইনবক্সে যাও 😻",
      "bye": "কই যাস? কোন চিপায় যাবি নাকি 🌚",
      "ami ebrahim": "জি বস, কেমন আছেন? ☺️",
      "tor nam ki": "MY NAME IS → 𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 🤖💖",
      "love you": "ভালোবাসা করতে চাইলে Boss ইব্রাহিম 😘",
      "kire": "হ্যাঁ বল, সব ঠিক তো? 😽",
      "😀": "এই দাঁত বের করছিস কেন? 😁",
      "😂": "আরে আরেকটু হাসলে চেয়ার ভাঙবে 🤣",
      "🤣": "ফাটাফাটি হাসি ভাই 😂🔥",
      "😍": "কারে দেখে এত প্রেম? 😍❤️",
      "🥰": "এই আদুরে, আমায় ভুলিস না 🥺",
      "😴": "ঘুমাইয়া পড় 😴",
      "🤒": "জ্বর নাকি? বিশ্রাম নে 🤒",
      "🤧": "হাঁচি হইছে? সাবধানে থাক 🤧"
    };

    if (responses[msg]) {
      return api.sendMessage(responses[msg], threadID, messageID);
    }

  } catch (err) {
    console.log("AutoReplyBot Error:", err);
  }
};

module.exports.run = async function () {};
