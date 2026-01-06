const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "SiFu",
    countDown: 5,
    role: 0,
    description: "Change the bot's prefix for your chat box or the entire system (admin only).",
    category: "config",
    guide: {
      en: "   {pn} <new prefix>: change new prefix in your box chat" +
        "\n   Example:" +
        "\n    {pn} #" +
        "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)" +
        "\n   Example:" +
        "\n    {pn} # -g" +
        "\n\n   {pn} reset: change prefix in your box chat to default"
    }
  },

  langs: {
    en: {
      reset: "✨ ʏᴏᴜʀ ᴘʀᴇғɪx ʀᴇsᴇᴛ ᴛᴏ ᴅᴇғᴀᴜʟᴛ: %1",
      onlyAdmin: "❌ ᴏɴʟʏ ᴀᴅᴍɪɴ ᴄᴀɴ ᴄʜᴀɴɢᴇ ᴛʜᴇ sʏsᴛᴇᴍ ᴘʀᴇғɪx",
      confirmGlobal: "⚠️ ᴘʟᴇᴀsᴇ ʀᴇᴀᴄᴛ ᴛᴏ ᴛʜɪs ᴍᴇssᴀɢᴇ ᴛᴏ ᴄᴏɴғɪʀᴍ sʏsᴛᴇᴍ ᴘʀᴇғɪx ᴄʜᴀɴɢᴇ",
      confirmThisThread: "⚠️ ᴘʟᴇᴀsᴇ ʀᴇᴀᴄᴛ ᴛᴏ ᴛʜɪs ᴍᴇssᴀɢᴇ ᴛᴏ ᴄᴏɴғɪʀᴍ ᴄʜᴀɴɢᴇ ɪɴ ᴛʜɪs ᴄʜᴀᴛ",
      successGlobal: "✅ ᴄʜᴀɴɢᴇᴅ sʏsᴛᴇᴍ ᴘʀᴇғɪx ᴛᴏ: %1",
      successThisThread: "✅ ᴄʜᴀɴɢᴇᴅ ᴘʀᴇғɪx ɪɴ ᴛʜɪs ᴄʜᴀᴛ ᴛᴏ: %1",
      myPrefix: "✨ ʜᴇʏ %1 ᴅɪᴅ ʏᴏᴜ ᴀsᴋ ᴍʏ ᴘʀᴇғɪx ‽ \n\n╭❂🌐❂╮  ɢʟᴏʙᴀʟ ᴘʀᴇꜰɪx: %2\n╰❂🌊❂╯  ʏᴏᴜʀ ʙᴏx: %3\n╭❂📘❂╮  ᴄᴍᴅ ᴍᴇɴᴜ: ʜᴇʟᴘ\n╰❂👑❂╯  ᴅᴇᴠ: Ebrahim\n\n ɪ'ᴍ %4 ᴀᴛ ʏᴏᴜʀ sᴇʀᴠɪᴄᴇ 🌊"
    }
  },

  onStart: async function({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g") {
      if (role < 2) return message.reply(getLang("onlyAdmin"));
      else formSet.setGlobal = true;
    } else {
      formSet.setGlobal = false;
    }

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function({ event, message, getLang, usersData }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      return async () => {
        const userName = await usersData.getName(event.senderID);
        const botName = global.GoatBot.config.nickNameBot || "Bot";
        return message.reply(getLang("myPrefix", userName, global.GoatBot.config.prefix, utils.getPrefix(event.threadID), botName));
      };
    }
  }
};
