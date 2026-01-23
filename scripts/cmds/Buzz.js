const delay = (ms) => new Promise(res => setTimeout(res, ms));

// স্টপ স্টেট ধরে রাখার জন্য গ্লোবাল ভেরিয়েবল
if (!global.alviStop) global.alviStop = new Map();

module.exports = {
  config: {
    name: "buzz",
    version: "8.0.0",
    author: "ALVI-BOSS",
    countDown: 5,
    role: 0,
    description: "রিপ্লাই দিলে নামসহ রোমান্টিক ও ফানি অ্যাটাক শুরু হয়",
    category: "fun",
    guide: {
      en: "Reply to a message with 'buzz' to start, or 'stop' to end it."
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageReply, type, body, senderID } = event;
    const stopKey = threadID + senderID;

    // ১. স্টপ লজিক: রিপ্লাই দিয়ে stop লিখলে থামবে
    if (type === "message_reply" && body && body.toLowerCase().includes("stop")) {
      if (global.alviStop.has(stopKey)) {
        global.alviStop.set(stopKey, true);
        return message.reply("🛑 ঠিক আছে বস, আলভি বসের স্পেশাল অ্যাটাক অফ করে দিলাম!");
      }
    }

    try {
      if (type !== "message_reply") {
        return message.reply("😅 আরে ভাই, যার ওপর 'বাজ' মারবেন তার মেসেজে আগে রিপ্লাই দিয়ে 'buzz' লিখুন!");
      }

      const targetID = messageReply.senderID;
      global.alviStop.set(stopKey, false);

      const userData = await api.getUserInfo(targetID);
      const name = userData[targetID].name;

      const messages = [
        `বস বলছে—ওহে ${name}, তোমার হাসি দেখলে চাঁদেরও হিংসা হয় 🌙😂❤️`,
        `শোনো ${name}, ইব্রাহিম বস এখন সিরিয়াস… তোমাকে খুব মিস করছে 😌🍛`,
        `${name}, বসের হৃদয়ে তোমার জন্য সিট বুকিং করা আছে, ভাড়া লাগবে না 🤭💖`,
        `ইব্রাহিম বস বলছে— ${name}, তুমি একদম ৫০০ টাকার কড়কড়ে নোটের মতো সুন্দর 💵💖`,
        `ওহে ${name}, তোমার রাগ দেখলে বসের এসি ছাড়াই ঠান্ডা লাগে ❄️😄`,
        `শোনো ${name}, তোমাকে ছাড়া বসের লাইফটা পাসওয়ার্ড ছাড়া ওয়াইফাইয়ের মতো ফালতু 🤍`,
        `ইব্রাহিম বস বলছে— ${name}, তুমি হাসলে তার ফোনের অটো-ব্রাইটনেস বেড়ে যায় 😄☀️`,
        `বস বলছে— ${name} হলো তার জীবনের 'আনলিমিটেড ডাটা প্যাক' 📶💖`,
        `ওরে ${name}, তোমার চোখের দিকে তাকালে বস রাস্তা ভুলে যায় 🛣️🥴`,
        `ইব্রাহিম বস কনফার্ম করেছে— ${name} ই তার পৃথিবীর অষ্টম আশ্চর্য! 🌍🔥`,
        `বস বলছে— ${name} ছাড়া তার লাইফ একদম নুন ছাড়া তরকারি 🍲😅`,
        `শোনো ${name}, বস তোমাকে ভাবতে ভাবতে লবণের জায়গায় চিনি দিয়ে চা বানিয়েছে ☕😅`,
        `ইব্রাহিম বস বলছে— ${name}, তুমি একদম আইফোনের মতো দামী কিন্তু মেইনটেইন করা কঠিন 📱😂`,
        `বস বলছে— ${name}, তোমার জন্য সে মরুভূমিতেও সাতার কাটতে রাজি! 🏊‍♂️🌵`,
        `ওহে ${name}, ইব্রাহিম বস বলছে তুমি হলে তার জীবনের চার্জার, তুমি না থাকলে সে অফ 🔋💝`,
        `ইব্রাহিম বস বলছে— ${name}, তুমি হাসলে তার ফেসবুকের রিচ বেড়ে যায় 😄🔥`,
        `${name}, বস বলছে তুমি হলে তার জীবনের 'Terms & Conditions' যা সে না পড়েই মেনে নেয় 📄❤️`,
        `বস বলছে— ${name}, তোমার ভয়ে সে এখন রাতে মশারির বদলে মাস্ক পরে ঘুমায় 😷😂`,
        `ইব্রাহিম বস বলছে— ${name}, তুমি হলে তার লাইফের সেই গান যেটা সে লুপে শোনে 🎶💖`,
        `বস বলছে— ${name}, তোমার রূপের তাপে তার ফোনের স্ক্রিনগার্ড ফেটে গেছে ☀️🔥`
      ];

      await message.reply(`😎 ${name}-এর ওপর ইব্রাহিম বসের "মেগা ফানি অ্যাটাক" শুরু! থামানোর জন্য 'stop' লিখে রিপ্লাই দিন।`);

      for (const msg of messages) {
        if (global.alviStop.get(stopKey) === true) {
          global.alviStop.delete(stopKey);
          return;
        }

        await delay(3000); 
        
        if (global.alviStop.get(stopKey) === true) {
          global.alviStop.delete(stopKey);
          return;
        }

        await api.sendMessage({
          body: msg,
          mentions: [{ tag: name, id: targetID }]
        }, threadID);
      }

      global.alviStop.delete(stopKey);
      await message.reply(`💘 মিশন সাকসেসফুল! ${name}-কে জ্বালানো আজকের মতো শেষ 😅`);

    } catch (err) {
      console.error(err);
      global.alviStop.delete(stopKey);
      return message.reply("❌ বটের তার ছিঁড়ে গেছে! আবার ট্রাই করেন।");
    }
  }
};
