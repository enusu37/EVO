const fs = require("fs-extra");
const { config, utils } = global.GoatBot;

module.exports = {
  config: {
    name: "adminonly",
    aliases: ["adonly", "onlyad", "onlyadmin"],
    version: "2.0",
    author: "ALVI-BOSS",
    countDown: 5,
    role: 2,
    description: {
      vi: "Bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
      en: "Turn on/off only admin can use bot"
    },
    category: "owner",
    guide: {
      vi: "{pn} [on | off]: bật/tắt chế độ chỉ admin mới có thể sử dụng bot\n{pn} noti [on | off]: bật/tắt thông báo khi người dùng không phải là admin sử dụng bot",
      en: "{pn} [on | off]: turn on/off the mode only admin can use bot\n{pn} noti [on | off]: turn on/off the notification when user is not admin use bot"
    }
  },

  langs: {
    vi: {
      turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
      turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
      turnedOnNoti: "Đã bật thông báo khi người dùng không phải là admin sử dụng bot",
      turnedOffNoti: "Đã tắt thông báo khi người dùng không phải là admin sử dụng bot",
      notAdmin: "❌ Bạn không phải là admin, không thể sử dụng bot!"
    },
    en: {
      turnedOn: "Turned on the mode only admin can use bot",
      turnedOff: "Turned off the mode only admin can use bot",
      turnedOnNoti: "Turned on the notification when user is not admin use bot",
      turnedOffNoti: "Turned off the notification when user is not admin use bot",
      notAdmin: "❌ You are not admin, you can't use this bot!"
    }
  },

  onStart: async function({ args, message, getLang }) {
    try {
      let isNoti = false;
      let value;
      let index = 0;

      if (args[0] === "noti") {
        isNoti = true;
        index = 1;
      }

      if (args[index] === "on") value = true;
      else if (args[index] === "off") value = false;
      else return message.SyntaxError();

      if (isNoti) {
        config.hideNotiMessage.adminOnly = !value;
        message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
      } else {
        config.adminOnly.enable = value;
        message.reply(getLang(value ? "turnedOn" : "turnedOff"));
      }

      await fs.writeFile(client.dirConfig, JSON.stringify(config, null, 2));
    } catch (err) {
      console.error(err);
      message.reply("❌ An error occurred while updating the config!");
    }
  },

  onChat: async function({ event, api, getLang }) {
    try {
      // যদি admin-only mode off হয়, skip
      if (!config.adminOnly.enable) return;

      // admin ID list
      const adminIDs = global.GoatBot.data.adminIDs.map(String);

      if (adminIDs.includes(String(event.senderID))) return;

      // যদি hideNotiMessage on না হয়
      if (!config.hideNotiMessage.adminOnly) {
        api.sendMessage(getLang("notAdmin"), event.threadID, event.messageID);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
