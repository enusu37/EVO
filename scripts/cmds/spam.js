module.exports = {
  config: {
    name: "spam",
    version: "1.0",
    author: "Islamick Cyber",
    role: 2,
    category: "spam",
    shortDescription: {
      en: "Spam message sender"
    },
    longDescription: {
      en: "Send a message multiple times"
    },
    guide: {
      en: "{p}spam [msg] [amount]"
    },
    cooldown: 5
  },

  onStart: async function ({ api, event, args, message }) {
    const permission = ["100065568407761"],["61556979016951"];

    if (!permission.includes(event.senderID)) {
      return message.reply("❌ | Only Bot Admin Can Use This Command");
    }

    if (args.length !== 2) {
      return message.reply(
        `⚠️ | Invalid Usage\nGuide: ${this.config.guide.en.replace("{p}", global.GoatBot.config.prefix)}`
      );
    }

    const msg = args[0];
    const count = parseInt(args[1]);

    if (isNaN(count) || count <= 0) {
      return message.reply("⚠️ | Amount must be a valid positive number");
    }

    const send = (text) => api.sendMessage(text, event.threadID);

    for (let i = 0; i < count; i++) {
      await send(msg);
    }

    return message.reply(`✅ | Successfully sent spam ${count} times`);
  }
};
