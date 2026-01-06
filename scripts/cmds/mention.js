const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "mention",
    aliases: ["spam", "mn"],
    version: "2.0",
    author: "SiFu", // As per your previous structure
    countDown: 5,
    role: 2,
    shortDescription: "Mention someone multiple times",
    longDescription: "Mention a user or multiple users multiple times with a custom delay.",
    category: "utility",
    guide: {
      en: "{pn} @mention [count]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { mentions, threadID, messageID, senderID } = event;

    // Stylish font mapping (Simplified example)
    const stylishText = (text) => {
      const fonts = {
        "a": "𝐚", "b": "𝐛", "c": "𝐜", "d": "𝐝", "e": "𝐞", "f": "𝐟", "g": "𝐠", "h": "𝐡", "i": "𝐢", "j": "𝐣", "k": "𝐤", "l": "𝐥", "m": "𝐦", "n": "𝐧", "o": "𝐨", "p": "𝐩", "q": "𝐪", "r": "𝐫", "s": "𝐬", "t": "𝐭", "u": "𝐮", "v": "𝐯", "w": "𝐰", "x": "𝐱", "y": "𝐲", "z": "𝐳"
      };
      return text.split("").map(char => fonts[char.toLowerCase()] || char).join("");
    };

    if (Object.keys(mentions).length === 0) {
      return api.sendMessage(`🎀 𝐄𝐫𝐫𝐨𝐫: Please mention at least one user!\n\nUsage: {pn} @name [count]`, threadID, messageID);
    }

    // Extract count from the last argument
    let count = parseInt(args[args.length - 1]);
    let repeatCount = isNaN(count) ? 5 : Math.min(count, 50); // Limit to 50 for safety

    const mentionIDs = Object.keys(mentions);
    
    api.sendMessage(`🎀 𝐒𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐌𝐞𝐧𝐭𝐢𝐨𝐧 𝐒𝐩𝐚𝐦...\n━━━━━━━━━━━━━━━━\n🎀 𝐓𝐚𝐫𝐠𝐞𝐭𝐬: ${mentionIDs.length}\n🎀 𝐑𝐞𝐩𝐞𝐚𝐭: ${repeatCount} times\n━━━━━━━━━━━━━━━━`, threadID);

    for (let i = 0; i < repeatCount; i++) {
      // Small delay to prevent spam trigger issues
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      for (const id of mentionIDs) {
        const name = mentions[id].replace("@", "");
        
        try {
          await api.sendMessage({
            body: `🎀 ${stylishText(name)} 🎀\n\n${stylishText("চিপা থেকে বের হও!")} 🐸🔪`,
            mentions: [{ tag: name, id: id }]
          }, threadID);
        } catch (err) {
          console.error("Mention Error:", err);
        }
      }
    }

    return api.sendMessage(`✅ 𝐌𝐞𝐧𝐭𝐢𝐨𝐧 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝!`, threadID);
  }
};
