const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
    config: {
        name: "help5",
        version: "1.17",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        shortDescription: { en: "View command usage" },
        longDescription: { en: "View command usage and list all commands directly" },
        category: "info",
        guide: { en: "{pn} / help cmdName" },
        priority: 1,
    },

    onStart: async function ({ message, args, event, threadsData, role }) {
        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        const prefix = getPrefix(threadID);

        if (args.length === 0) {
            let msg = "╔══════════════╗\n     🌟 Lord Cmds 🌟\n╚══════════════╝";
            const categories = {};

            commands.forEach((value, name) => {
                if (value.config.role > 1 && role < value.config.role) return;
                const category = value.config.category || "Uncategorized";
                categories[category] = categories[category] || [];
                categories[category].push(name);
            });

            Object.keys(categories).forEach(category => {
                if (category !== "info") {
                    msg += `\n╭────────────⭓\n│ 『 ${category.toUpperCase()} 』`;
                    categories[category].sort().forEach(cmd => {
                        msg += `\n│ 💠 ${cmd} 💠`;
                    });
                    msg += `\n╰────────⭓`;
                }
            });

            msg += `\n✨ The bot has ${commands.size} commands available. ✨\n`;
            msg += `📝 Type ${prefix} help cmdName to view details of that command.\n`;
            msg += `👑 Owners:\nJayden Smith\n🔗 Link: https://m.me/lordjaydenSmith.1`;

            const images = ["https://i.imgur.com/sS7H2mt.jpeg"];
            const image = images[Math.floor(Math.random() * images.length)];

            await message.reply({
                body: msg,
                attachment: await global.utils.getStreamFromURL(image)
            });
        } else {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName) || commands.get(aliases.get(commandName));

            if (!command) {
                await message.reply(`❌ Command "${commandName}" not found.`);
            } else {
                const config = command.config;
                const usage = config.guide?.en.replace(/{pn}/g, prefix).replace(/{cmdName}/g, config.name);
                const response = `╭── 📜 NAME 📜 ────⭓
│ ${config.name}
├── 📚 INFO 📚
│ 📝 Description: ${config.longDescription?.en || "No description"}
│ 🆚 Version: ${config.version}
│ 🔑 Role: ${roleTextToString(config.role)}
│ ⏳ Cooldown: ${config.countDown || 1}m
│ ✍️ Author: ${config.author || "Unknown"}
├── 🛠️ Usage 🛠️
│ ${usage}
╰━━━━━━━❖`;
                await message.reply(response);
            }
        }
    }
};

function roleTextToString(role) {
    switch (role) {
        case 0: return "All users";
        case 1: return "Group administrators";
        case 2: return "Admin bot";
        default: return "Unknown role";
    }
}