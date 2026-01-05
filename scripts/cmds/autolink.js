const fs = require("fs-extra");
const axios = require("axios");
const { downloadVideo } = require("sagor-video-downloader");

module.exports = {
    config: {
        name: "autolink",
        version: "2.0",
        author: "ALVI-BOSS",
        countDown: 5,
        role: 0,
        shortDescription: "Auto-download videos with style",
        longDescription: "অটোমেটিক ভিডিও ডাউনলোড করে চমৎকার ইন্টারফেসে সেন্ড করবে।",
        category: "media",
        guide: {
            en: "{p}{n} [link]"
        }
    },

    onChat: async function ({ api, event }) {
        const { threadID, messageID, body } = event;
        if (!body) return;

        const linkMatches = body.match(/(https?:\/\/[^\s]+)/g);
        if (!linkMatches) return;

        const uniqueLinks = [...new Set(linkMatches)];

        for (const url of uniqueLinks) {
            // ১. "দাঁড়া গরিব" মেসেজ পাঠানো
            const waitMsg = await api.sendMessage("⌛ দাঁড়াগরিব ডাউনলোড করে দিচ্ছে...", threadID, messageID);

            try {
                const { title, filePath } = await downloadVideo(url);
                
                if (!filePath || !fs.existsSync(filePath)) {
                    throw new Error("ফাইল পাওয়া যায়নি");
                }

                const stats = fs.statSync(filePath);
                const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

                // সাইজ ২৫ এমবি এর বেশি হলে
                if (parseFloat(fileSizeInMB) > 25) {
                    await api.sendMessage(`⚠️ ফাইলটি খুব বড় (${fileSizeInMB}MB), লিমিট ২৫ এমবি।`, threadID);
                    fs.unlinkSync(filePath);
                    api.unsendMessage(waitMsg.messageID);
                    continue;
                }

                // সময় ও তারিখ
                const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
                const date = new Date().toLocaleDateString('en-GB');

                // ২. ভিডিও পাঠানো (আপনার ছবির স্টাইলে মেসেজ)
                const msgBody = `╭────────────❍\n` +
                                `│ 📛 SIZUKA DOWNLOADER ♻️\n` +
                                `├───────────────\n` +
                                `│ 📌 TITLE : ${title || "Undefined"}\n` +
                                `│ 🌍 PLATFORM : VIDEO\n` +
                                `│ 📦 SIZE  : ${fileSizeInMB} MB\n` +
                                `│ 📂 FORMAT : MP4\n` +
                                `├───────────────\n` +
                                `│ 📅 DATE : ${date}\n` +
                                `│ 🕒 TIME : ${time}\n` +
                                `╰────────────❍`;

                await api.sendMessage({
                    body: msgBody,
                    attachment: fs.createReadStream(filePath)
                }, threadID);

                // ৩. কাজ শেষ হলে "দাঁড়াগরিব" মেসেজটি ডিলিট করা
                api.unsendMessage(waitMsg.messageID);
                
                // ফাইল ডিলিট করা স্টোরেজ সেভ করতে
                fs.unlinkSync(filePath);

            } catch (error) {
                console.error(error);
                api.unsendMessage(waitMsg.messageID); // এরর হলেও ওয়েটিং মেসেজ মুছে যাবে
            }
        }
    }
};
