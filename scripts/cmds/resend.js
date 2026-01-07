const fs = require("fs-extra");
const axios = require("axios");

if (!fs.existsSync(__dirname + "/cache")) {
  fs.mkdirSync(__dirname + "/cache");
}

module.exports = {
  config: {
    name: "resend",
    aliases: ["rs"],
    version: "2.0",
    author: "CYBER TEAM ☢️",
    role: 0,
    shortDescription: {
      en: "Auto resend unsent messages"
    },
    longDescription: {
      en: "Automatically resend messages that someone unsent"
    },
    category: "general",
    guide: {
      en: "{pn} - toggle resend feature"
    },
    dependencies: {
      "fs-extra": "",
      axios: ""
    }
  },

  onStart: async function ({ api, event, threadsData }) {
    const { threadID } = event;

    let data = await threadsData.get(threadID);

    const current = data?.resend === false ? false : true;

    await threadsData.set(threadID, {
      resend: !current
    });

    return api.sendMessage(
      `🐐 Resend Feature is now ${!current ? "ON" : "OFF"}`,
      threadID
    );
  },

  onChat: async function ({ event, api, usersData }) {
    const { threadID, messageID, senderID, body, attachments, type, messageReply } = event;

    if (!global.resendLog) {
      global.resendLog = new Map();
    }

    const botID = api.getCurrentUserID();

    let thread = global.db?.threadData?.get(threadID);

    if (thread?.resend === false) return;
    if (senderID == botID) return;

    if (type !== "message_unsend") {
      global.resendLog.set(messageID, {
        msgBody: body,
        attachment: attachments,
        senderID: senderID
      });
    }

    if (type === "message_unsend") {
      const msg = global.resendLog.get(messageID);
      if (!msg) return;

      const name = await usersData.getName(senderID);

      if (!msg.attachment || msg.attachment.length === 0) {
        return api.sendMessage(
          {
            body: `═════════════════════\n🐐 Goat Chat Bot\n═════════════════════\n\nকই গো সবাই দেখুন🥺\n@${name} এই হালায়\nমাত্র 👉 [${msg.msgBody}] 👈\nএই টেক্সট টা রিমুভ দিছে😁`,
            mentions: [
              {
                tag: name,
                id: senderID
              }
            ]
          },
          threadID
        );
      }

      let attachmentsList = [];
      let count = 0;

      for (const file of msg.attachment) {
        count++;
        try {
          const ext = file.url.substring(file.url.lastIndexOf(".") + 1);
          const filePath = `${__dirname}/cache/resend_${count}.${ext}`;

          const fileData = (
            await axios.get(file.url, { responseType: "arraybuffer" })
          ).data;

          fs.writeFileSync(filePath, Buffer.from(fileData));

          attachmentsList.push(fs.createReadStream(filePath));
        } catch (err) {
          console.log("Attachment resend error:", err);
        }
      }

      return api.sendMessage(
        {
          body: `🐐 কই গো সবাই দেখুন 😁\n@${name} এই মাত্র মেসেজ রিমুভ দিছিল – আবার পাঠিয়ে দিলামঃ\n\n${msg.msgBody}`,
          attachment: attachmentsList,
          mentions: [
            {
              tag: name,
              id: senderID
            }
          ]
        },
        threadID
      );
    }
  },

  languages: {
    en: {
      on: "ON",
      off: "OFF",
      successText: "Resend toggled successfully"
    }
  }
};
