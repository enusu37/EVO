  module.exports = {
  config: {
    name: "war",
    aliases: ["chud"],
    version: "1.1",
    author: "nexo_here",
    role: 2, // Admin only
    category: "admin",
    guide: {
      vi: "Not Available",
      en: "chud @(mention) or reply to a message"
    } 
  },

  onStart: async function ({ api, event, args }) {
    let mentionID;
    let name;

    // চেক করা হচ্ছে রিপ্লে করা হয়েছে কি না অথবা মেনশন করা হয়েছে কি না
    if (event.type === "message_reply") {
      mentionID = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      mentionID = Object.keys(event.mentions)[0];
    }

    if (!mentionID) {
      return api.sendMessage("কাউকে মেনশন করুন অথবা কারো মেসেজে রিপ্লে দিয়ে কমান্ডটি লিখুন!", event.threadID);
    }

    // ইউজারের নাম সংগ্রহ (যদি মেনশন থাকে তবে নাম নিবে, নাহলে আইডি দিয়ে প্রোফাইল থেকে নাম খুঁজবে)
    if (event.mentions[mentionID]) {
        name = event.mentions[mentionID].replace(/@/g, "");
    } else {
        const userInfo = await api.getUserInfo(mentionID);
        name = userInfo[mentionID].name;
    }

    var arraytag = [{ id: mentionID, tag: name }];
    var a = function (msg) { api.sendMessage(msg, event.threadID); }

    // মেসেজ লিস্ট এবং টাইমিং (আপনার আগের মেসেজগুলোই রাখা হয়েছে)
    setTimeout(() => {a({body: "কিরে মাদারচোত ইব্রাহিম এর চুদন খাওয়ায় জন্য রেডি তো? " + name, mentions: arraytag})}, 3000);
    setTimeout(() => {a({body: "মাঘি চুদা শরের বাচ্চা কার লগে পঙ্গা নিতে আসছিস 🤬🤬🤬 " + name, mentions: arraytag})}, 5000);
    setTimeout(() => {a({body: "চুদে গুহা ফাঁক করে দিব খানকীর পোলা 🤤 " + name, mentions: arraytag})}, 7000);
    setTimeout(() => {a({body: "মাদারচোত বোকাচোদা খানকীর পোলা " + name, mentions: arraytag})}, 9000);
    setTimeout(() => {a({body: "বেসসা মাঘী চোদা কুত্তা চোদা " + name, mentions: arraytag})}, 12000);
    setTimeout(() => {a({body: "ছাগল চুদা গরু চুদা মাঙ্গের বেটা লোকজন দেখে লাগতে আসিস কুত্তার বাচ্চা 🤬 " + name, mentions: arraytag})}, 14000);
    setTimeout(() => {a({body: "তোর আব্বুকে ভুলে গেলি মাদারচোত 😂 " + name, mentions: arraytag})}, 16000);
    setTimeout(() => {a({body: "তোকে কনডম ছাড়া চুদী মঙ্গের বেটা 🖕🏿 " + name, mentions: arraytag})}, 18000);
    setTimeout(() => {a({body: "আমার ধন চুষ তাইলে থামবো 😂 " + name, mentions: arraytag})}, 20000);
    setTimeout(() => {a({body: "তোরে কুত্তা দিয়ে চোদাই 😍 " + name, mentions: arraytag})}, 22000);
    setTimeout(() => {a({body: "মাঘীর মাং চাটিস বোকাচোদার বাচ্চা তোকে কন্ডম ছাড়া উল্টা করে চুদি 🤬 " + name, mentions: arraytag})}, 24000);
    setTimeout(() => {a({body: "এখনো সময় আছে মাফ চা 🤣🤣 " + name, mentions: arraytag})}, 26000);
    setTimeout(() => {a({body: "তোর নানি কেমন আছে 😍?? " + name, mentions: arraytag})}, 28000);
    setTimeout(() => {a({body: "তোকে চুদী 🥰 " + name, mentions: arraytag})}, 30000);
    setTimeout(() => {a({body: "মাদারচোত 🥰 " + name, mentions: arraytag})}, 32000);
    setTimeout(() => {a({body: "আব্বা কে ভুলিস না 🤬 " + name, mentions: arraytag})}, 34000);
    setTimeout(() => {a({body: "আজকের চুদন আজীবন মনে রাখিস বোকাচোদা 🤣🤣🤣 " + name, mentions: arraytag})}, 36000);
    setTimeout(() => {a({body: "হোল কাটে নিবো 🤬🤬🤬🤬🤬🤬 " + name, mentions: arraytag})}, 38000);
    setTimeout(() => {a({body: "তোকে ডগি স্টাইল e চুদী 😋😋 " + name, mentions: arraytag})}, 40000);
    setTimeout(() => {a({body: "ইব্রাহিম এর চুদন কেমন লাগলো বাচ্চা 🤣🤣🤣🤣?? " + name, mentions: arraytag})}, 42000);
  }
};
