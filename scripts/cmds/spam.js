module.exports = {
  config: {
    name: "spam",
    version: "1.2",
    author: "Islamick Cyber",
    role: 2,
    category: "spam",
    shortDescription: {
      en: "Spam message sender with delay"
    },
    longDescription: {
      en: "Send a message multiple times with 1-2s delay (Max 100)"
    },
    guide: {
      en: "{p}spam [message] [amount]"
    },
    cooldown: 5
  },

  onStart: async function ({ api, event, args, message }) {
    const permission = ["100065568407761", "61556979016951"];

    if (!permission.includes(event.senderID)) {
      return message.reply("❌ | Only Bot Admin Can Use This Command");
    }

    if (args.length < 2) {
      return message.reply(
        `⚠️ | Invalid Usage\nGuide: ${this.config.guide.en.replace("{p}", global.GoatBot.config.prefix)}`
      );
    }

    const count = parseInt(args[args.length - 1]);
    const msg = args.slice(0, args.length - 1).join(" ");

    if (isNaN(count) || count <= 0) {
      return message.reply("⚠️ | Amount must be a valid positive number");
    }

    if (count > 100) {
      return message.reply("⚠️ | Maximum spam limit is 100 times.");
    }

    // ডিলে বা বিরতি দেওয়ার ফাংশন
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    message.reply(`🚀 | Spamming started for ${count} times with delay...`);

    for (let i = 0; i < count; i++) {
      await api.sendMessage(msg, event.threadID);
      
      // প্রতি মেসেজের পর ১.৫ সেকেন্ড (১৫০০ মিলিসেকেন্ড) বিরতি
      if (i < count - 1) {
        await delay(1500); 
      }
    }

    return api.sendMessage(`✅ | Successfully finished spamming ${count} times.`, event.threadID);
  }
};
