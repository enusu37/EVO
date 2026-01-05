module.exports.config = {
  name: "groupupdate",
  eventType: [
    "log:thread-name",
    "log:thread-image",
    "log:user-nickname",
    "log:thread-admins",
    "log:thread-color",
    "log:thread-emoji",
    "call_started"
  ],
  version: "2.0.0",
  credits: "ALVI",
  description: "Goat Bot v2 Stylish Group Update Notification"
};

module.exports.run = async function({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData, author } = event;

  let authorName = "Unknown";
  try {
    authorName = await Users.getNameUser(author);
  } catch {}

  const box = (title, body) =>
`★═─ ${title} ─═★
${body}
▬▬▬▬▬▬▬▬▬▬▬▬`;

  const sendAutoDelete = async (msg) => {
    api.sendMessage(msg, threadID, (err, info) => {
      if (err) return;
      setTimeout(() => api.unsendMessage(info.messageID), 5000);
    });
  };

  // 💬 GROUP NAME
  if (logMessageType === "log:thread-name") {
    return sendAutoDelete(
      box("📝 GROUP NAME UPDATED",
        `➤ New Name: ${logMessageData.name}\n➤ By: ${authorName}`
      )
    );
  }

  // 🖼️ GROUP PHOTO
  if (logMessageType === "log:thread-image") {
    return sendAutoDelete(
      box("📸 GROUP PHOTO UPDATED",
        `➤ The group profile picture has been changed\n➤ By: ${authorName}`
      )
    );
  }

  // 🏷️ NICKNAME
  if (logMessageType === "log:user-nickname") {
    const targetName = await Users.getNameUser(logMessageData.participant_id);
    return sendAutoDelete(
      box("✏️ NICKNAME UPDATED",
        `➤ User: ${targetName}\n➤ New Nickname: ${logMessageData.nickname || "Removed"}\n➤ By: ${authorName}`
      )
    );
  }

  // 👑 ADMIN ADD / REMOVE
  if (logMessageType === "log:thread-admins") {
    const targetName = await Users.getNameUser(logMessageData.target_id);
    if (logMessageData.ADMIN_EVENT === "add_admin") {
      return sendAutoDelete(
        box("✅ ADMIN ADDED",
          `➤ ${targetName} is now an Admin\n➤ By: ${authorName}`
        )
      );
    }
    if (logMessageData.ADMIN_EVENT === "remove_admin") {
      return sendAutoDelete(
        box("❌ ADMIN REMOVED",
          `➤ ${targetName} removed from Admin\n➤ By: ${authorName}`
        )
      );
    }
  }

  // 🎨 THEME COLOR
  if (logMessageType === "log:thread-color") {
    return sendAutoDelete(
      box("🌈 THEME UPDATED",
        `➤ Group theme color has been changed\n➤ By: ${authorName}`
      )
    );
  }

  // 😀 EMOJI
  if (logMessageType === "log:thread-emoji") {
    return sendAutoDelete(
      box("✨ GROUP EMOJI UPDATED",
        `➤ New Emoji: ${logMessageData.emoji}\n➤ By: ${authorName}`
      )
    );
  }

  // 📞 AUDIO/VIDEO CALL
  if (logMessageType === "call_started") {
    const callType = logMessageData.is_video_call ? "📹 VIDEO CALL" : "🎧 AUDIO CALL";
    return sendAutoDelete(
      box("☎️ CALL STARTED",
        `➤ ${callType} has started\n➤ By: ${authorName}`
      )
    );
  }
};
