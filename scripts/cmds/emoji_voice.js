const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emoji_voice",
    version: "1.0.2",
    author: "ALVI-BOSS",
    countDown: 5,
    role: 0,
    shortDescription: "ইমোজি দিলে কিউট মেয়ের ভয়েস পাঠাবে 😍",
    longDescription: "যে কোনো নির্দিষ্ট ইমোজি পাঠালে কিউট ভয়েস মেসেজ পাঠাবে 😘",
    category: "noPrefix"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const { body } = event;
    if (!body || body.length > 2) return;

    const emojiAudioMap = {
 "😫": "https://files.catbox.moe/61yy0n.mp4",
 "🌚": "https://files.catbox.moe/q45alm.mp3",
 "👀": "https://files.catbox.moe/iue6y4.mp3",
 "🤐": "https://files.catbox.moe/x874wn.mp3",
 "💬": "https://files.catbox.moe/bltq8z.mp3",
 "😗": "https://files.catbox.moe/37dqpx.mp3",
 "😇": "https://files.catbox.moe/x6kgtq.mp3",
 "🫠": "https://files.catbox.moe/gq5ycc.mp3",
 "😡": "https://files.catbox.moe/tqjas3.mp3",
 "💦": "https://files.catbox.moe/m434dv.mp3",
 "🥳": "https://files.catbox.moe/xypl02.mp4",
 "🤠": "https://files.catbox.moe/25wpzv.mp3",
 "🦶": "https://files.catbox.moe/t6kyy8.mp3",
 "👏": "https://files.catbox.moe/uofy07.mp3",
 "😊": "https://files.catbox.moe/ivmq9w.mp3",
 "😛": "https://files.catbox.moe/t9xjmt.mp3",
"🎉": "https://files.catbox.moe/ynpd2f.mp3",
"🎊": "https://files.catbox.moe/ynpd2f.mp3",
"🫂": "https://files.catbox.moe/u9j39a.mp3",
"❤️‍🩹": "https://files.catbox.moe/g4b0qw.mp3",
"⚡": "https://files.catbox.moe/fg43xo.mp3",
"👩‍❤️‍💋‍👨": "https://files.catbox.moe/0bjbxy.mp3",
"💓": "https://files.catbox.moe/po9hhv.mp3",
"💗": "https://files.catbox.moe/po9hhv.mp3",
"🤍": "https://files.catbox.moe/iadsrj.mp3",
"💛": "https://files.catbox.moe/iadsrj.mp3",
"🧡": "https://files.catbox.moe/iadsrj.mp3",
"💚": "https://files.catbox.moe/iadsrj.mp3",
"💙": "https://files.catbox.moe/iadsrj.mp3",
"💜": "https://files.catbox.moe/iadsrj.mp3",
"🤎": "https://files.catbox.moe/iadsrj.mp3",
"🖤": "https://files.catbox.moe/iadsrj.mp3",
"😼": "https://files.catbox.moe/0jdk2l.mp3",
"😠": "https://files.catbox.moe/vkdh0v.mp3",
"😈": "https://files.catbox.moe/vkdh0v.mp3",
"🌙": "https://files.catbox.moe/rqm2wq.mp3",
"🙂": "https://files.catbox.moe/q6tv9v.mp3",
"🌜": "https://files.catbox.moe/rqm2wq.mp3",
"🌠": "https://files.catbox.moe/rqm2wq.mp3",
"😎": "https://files.catbox.moe/sn33xe.mp3",
"🤦‍♀️": "https://files.catbox.moe/vwtxj1.mp3",
"💝": "https://files.catbox.moe/gcjnq5.mp3"
    };

    const emoji = body.trim();
    const audioUrl = emojiAudioMap[emoji];
    if (!audioUrl) return;

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const filePath = path.join(cacheDir, `${encodeURIComponent(emoji)}.mp3`);

    try {
      const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data));

      await message.reply({
        attachment: fs.createReadStream(filePath)
      });

      fs.unlink(filePath);
    } catch (error) {
      console.error(error);
      message.reply("ইমুজি দিয়ে লাভ নাই 😒\nযাও মুড়ি খাও জান 😘");
    }
  }
};
