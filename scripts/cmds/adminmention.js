module.exports = {
  config: {
    name: "adminmention",
    version: "1.4.0",
    author: "ALVI-BOSS",
    countDown: 0,
    role: 0,
    shortDescription: "Angry reply when admin is mentioned",
    longDescription: "Bot replies angrily if someone mentions admin name",
    category: "fun"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData }) {
    if (!event.body) return;

    const adminUID = "100065568407761"; // admin UID
    const senderID = String(event.senderID);

    // admin নিজে হলে ignore
    if (senderID === adminUID) return;

    // admin name বের করা
    const adminName = await usersData.getName(adminUID);
    if (!adminName) return;

    // message এ admin নাম আছে কিনা
    const text = event.body.toLowerCase();
    if (!text.includes(adminName.toLowerCase())) return;

    const REPLIES = [
      "বস বলছে—\"এই আবালটা আবার কে?\" 😶🌫️📣",
      "মেনশন দিছস ঠিকই, কিন্তু বস তো এখন নেট অফ রাখছে 🤫📴",
      "বস বলল তোরে রেপ্লাই দিবে কিন্তু আগে তুই গোসল করে আয় 🤢🧼",
      "বস তো এখন চা খাচ্ছে, তুই ততক্ষণ মাথা ঠান্ডা রাখ বস পড়ে আসবে 😌🍵",
      "বস এক আবালে আপনাকে মেনশন দিছে 😑🌚😁",
      "বস এক পাগল ছাগল , আপনাকে ডাকতেছে 🐸🫵",
      "বস এক হালায় আপনার নাম ধরছে , আপনি শুধু একবার আদেশ করুন, আজকে হালার নানিরে চমলক্ক করে দিমু 😑🥴",
      "বস এক আবাল আপনাকে ডাকতেছে 😂😏",
      "আবাল তুই মেনশন দিবি না আমার বস রে 🥹",
    ];

    const randomReply =
      REPLIES[Math.floor(Math.random() * REPLIES.length)];

    return message.reply(randomReply);
  }
};
