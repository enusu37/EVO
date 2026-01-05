const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const API_ENDPOINT = "https://tawsif.is-a.dev/gemini/nano-banana";

function extractImageUrl(args, event) {
  // Check for direct URL
  let imageUrl = args.find(arg => arg.startsWith('http'));

  // Check for replied image
  if (!imageUrl && event.messageReply && event.messageReply.attachments) {
    const imageAttachment = event.messageReply.attachments.find(
      att => att.type === 'photo' || att.type === 'image'
    );
    if (imageAttachment) imageUrl = imageAttachment.url;
  }

  return imageUrl;
}

function extractPrompt(args, imageUrl) {
  let prompt = args.join(' ');
  if (imageUrl) prompt = prompt.replace(imageUrl, '').trim();
  if (prompt.includes('|')) prompt = prompt.split('|')[0].trim();
  return prompt || 'enhance quality';
}

module.exports = {
  config: {
    name: "edit",
    aliases: ["imgedit", "nanoedit"],
    version: "2.3",
    author: "NeoKEX | Modified by Goat Bot v2",
    role: 0,
    countDown: 15,
    category: "ai-image",
    longDescription: "Edit or modify an existing image using a text prompt.",
    guide: {
      en: "{pn} [modification prompt] OR reply to an image with [modification prompt]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const imageUrl = extractImageUrl(args, event);
    const editPrompt = extractPrompt(args, imageUrl);

    if (!imageUrl)
      return message.reply("❌ দয়া করে একটি ইমেজ URL দিন বা কোনো ইমেজ রিপ্লাই করুন।");

    if (!editPrompt)
      return message.reply("❌ দয়া করে ইমেজের পরিবর্তনের জন্য একটি প্রম্পট দিন।");

    message.reaction("⏳", event.messageID);

    let tempFilePath;
    try {
      const apiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(editPrompt)}&url=${encodeURIComponent(imageUrl)}`;

      const { data } = await axios.get(apiUrl);
      if (!data.success || !data.imageUrl)
        throw new Error(data.error || "API থেকে সঠিক ইমেজ URL পাওয়া যায়নি।");

      const imageStream = await axios.get(data.imageUrl, { responseType: 'stream' });
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      tempFilePath = path.join(cacheDir, `edited_nano_${Date.now()}.png`);
      const writer = fs.createWriteStream(tempFilePath);
      imageStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", err => { writer.close(); reject(err); });
      });

      message.reaction("✅", event.messageID);
      await message.reply({ attachment: fs.createReadStream(tempFilePath) });

    } catch (err) {
      message.reaction("❌", event.messageID);
      console.error("Edit Command Error:", err);

      let errorMsg = "❌ ইমেজ এডিট করার সময় সমস্যা হয়েছে।";
      if (err.response?.data?.error) errorMsg += ` (API Error: ${err.response.data.error})`;
      else if (err.message) errorMsg = `❌ ${err.message}`;
      else if (err.code) errorMsg = `❌ Network Error: ${err.code}`;

      message.reply(errorMsg);
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    }
  }
};
