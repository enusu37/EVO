const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "rip",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Scooby Doo template memes",
    commandCategory: "Picture",
    usages: "[mention]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "jimp": "",
        "node-superfetch": ""
    }
};

// Dummy onStart to satisfy Goat Bot v2 installer
module.exports.onStart = async () => {
    return;
};

// Circle crop helper
module.exports.circle = async (imageBuffer) => {
    const jimp = global.nodemodule.jimp;
    const image = await jimp.read(imageBuffer);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ api, event, Users }) => {
    try {
        const canvas = global.nodemodule.canvas;
        const superfetch = global.nodemodule["node-superfetch"];

        // Cache folder
        const cachePath = path.join(__dirname, "cache");
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
        const outputPath = path.join(cachePath, `rip_${event.senderID}.jpg`);

        // Target user: mention or self
        const targetUserId = Object.keys(event.mentions)[0] || event.senderID;

        // Load template image
        const template = await canvas.loadImage("https://i.imgur.com/jHrYZ5Y.jpeg");

        // Fetch profile picture
        let { body: profilePicBuffer } = await superfetch.get(
            `https://graph.facebook.com/${targetUserId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        );
        profilePicBuffer = await module.exports.circle(profilePicBuffer);

        // Create canvas
        const c = canvas.createCanvas(500, 670);
        const ctx = c.getContext("2d");

        // Draw template & profile pic
        ctx.drawImage(template, 0, 0, c.width, c.height);
        const profileImage = await canvas.loadImage(profilePicBuffer);
        ctx.drawImage(profileImage, 30, 469, 178, 178);

        // Save final image
        const finalBuffer = c.toBuffer();
        fs.writeFileSync(outputPath, finalBuffer);

        // Send message
        api.sendMessage(
            {
                body: "তুই একটা বদল\nমাথায় গোবর-গু ছাড়া কিছু নাই🤣😹",
                attachment: fs.createReadStream(outputPath)
            },
            event.threadID,
            () => fs.unlinkSync(outputPath),
            event.messageID
        );

    } catch (err) {
        console.log(err);
        api.sendMessage("😵‍💫 কিছু সমস্যা হয়েছে, পরে চেষ্টা করো!", event.threadID);
    }
};
