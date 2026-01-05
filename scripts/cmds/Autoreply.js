module.exports = {
  config: {
    name: "autoreply",
    version: "1.0",
    author: "ChatGPT",
    description: "Simple No Prefix Auto Reply for Goat Bot v2",
    eventType: ["message"],
    dependencies: {}
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (!event.body) return;

    const text = event.body.toLowerCase();

    const replies = [
      {
        keywords: ["hi", "hello", "hey"],
        reply: "👋 হ্যালো! কেমন আছো?"
      },
      {
        keywords: ["assalamualaikum", "salam"],
        reply: "🤍 ওয়ালাইকুমুস সালাম"
      },
      {
        keywords: ["bot", "robot"],
        reply: "🤖 হ্যাঁ বলো! আমি Goat Bot v2 😎"
      },
      {
        keywords: ["love", "valobashi"],
        reply: "❤️ ভালোবাসা দিলে রিটার্ন ডাবল 😌"
      },
      {
        keywords: ["admin"],
        reply: "👑 অ্যাডমিন এখন ব্যস্ত, পরে চেষ্টা করো"
      },
      {
        keywords: ["bye", "goodbye"],
        reply: "👋 আবার কথা হবে ইনশাআল্লাহ"
      }
    ];

    for (const item of replies) {
      if (item.keywords.some(key => text.includes(key))) {
        return message.reply(item.reply);
      }
    }
  }
};
