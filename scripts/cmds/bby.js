const axios = require('axios');
const baseApiUrl = async () => {
 return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
 name: "bby",
 aliases: ["baby", "bbe", "bot", "rocky", "babe"],
 version: "6.9.0",
 author: "ROCKY 320",
 countDown: 0,
 role: 0,
 description: "better then all sim simi",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: {
 en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
 }
};

module.exports.onStart = async ({
 api,
 event,
 args,
 usersData
}) => {
 const link = `${await baseApiUrl()}/baby`;
 const dipto = args.join(" ").toLowerCase();
 const uid = event.senderID;
 let command, comd, final;

 try {
 if (!args[0]) {
 const ran = ["Bolo baby", "hum", "type help baby", "type +baby hi"];
 return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
 }

 if (args[0] === 'remove') {
 const fina = dipto.replace("remove ", "");
 const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
 return api.sendMessage(dat, event.threadID, event.messageID);
 }

 if (args[0] === 'rm' && dipto.includes('-')) {
 const [fi, f] = dipto.replace("rm ", "").split(' - ');
 const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
 return api.sendMessage(da, event.threadID, event.messageID);
 }

 if (args[0] === 'list') {
 if (args[1] === 'all') {
 const data = (await axios.get(`${link}?list=all`)).data;
 const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
 const number = Object.keys(item)[0];
 const value = item[number];
 const name = (await usersData.get(number)).name;
 return {
 name,
 value
 };
 }));
 teachers.sort((a, b) => b.value - a.value);
 const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
 return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
 } else {
 const d = (await axios.get(`${link}?list=all`)).data.length;
 return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
 }
 }

 if (args[0] === 'msg') {
 const fuk = dipto.replace("msg ", "");
 const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
 return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
 }

 if (args[0] === 'edit') {
 const command = dipto.split(' - ')[1];
 if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
 return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
 const tex = re.data.message;
 const teacher = (await usersData.get(re.data.teacher)).name;
 return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'amar') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
 return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'react') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach react ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
 return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
 }

 if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
 const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
 return api.sendMessage(data, event.threadID, event.messageID);
 }

 const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
 api.sendMessage(d, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 d,
 apiUrl: link
 });
 }, event.messageID);

 } catch (e) {
 console.log(e);
 api.sendMessage("Check console for error", event.threadID, event.messageID);
 }
};

module.exports.onReply = async ({
 api,
 event,
 Reply
}) => {
 try {
 if (event.type == "message_reply") {
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 a
 });
 }, event.messageID);
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.onChat = async ({
 api,
 event,
 message
}) => {
 try {
 const body = event.body ? event.body?.toLowerCase() : ""
 if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("বেবি") || body.startsWith("bot") || body.startsWith("rocky") || body.startsWith("babu") || body.startsWith("বট")) {
 const arr = body.replace(/^\S+\s*/, "")
 const randomReplies = [
"🥺amake na deke amr boss ar inbox a nok deo my boss inbox m.me/rocky.vai.320 🫢",
  "😀 my owner inbox link m.me/rocky.vai.320 😿",
  "🐸 new sms deu m.me/rocky.vai.320 🙍‍♂️", 
  "𝐯𝐮𝐥𝐞 𝐣𝐚𝐰 𝐚𝐦𝐚𝐤𝐞 😅",
  "𝐭𝐮𝐦𝐚𝐫 𝐧𝐚𝐧𝐢𝐫 𝐤𝐡𝐚𝐥𝐢 𝐠𝐡𝐨𝐫 𝐚 𝐚𝐬𝐢 𝐧𝐨𝐭 𝐝𝐢𝐬𝐭𝐮𝐩🤗",
  "𝐚𝐛𝐚𝐥 𝐛𝐨𝐭 𝐚𝐦𝐢🤪🤷‍♂️❓ ",
  "𝐮𝐦𝐦𝐦𝐚 𝐝𝐢𝐥𝐞 5 𝐭𝐚𝐤𝐚  𝐝𝐢𝐛𝐨😙",
  "𝐭𝐮𝐫 𝐣𝐚𝐦𝐚𝐢 𝐚𝐦𝐫 𝐚𝐦𝐫 𝐣𝐚𝐦𝐚𝐢 𝐭𝐮𝐫 𝐝𝐮𝐥𝐚𝐯𝐚𝐢😹",
  "𝐟𝐫𝐢𝐞𝐧𝐝 𝐫𝐞𝐪𝐮𝐬𝐭 𝐝𝐢𝐥𝐞 100 𝐭𝐚𝐤𝐚 𝐝𝐢𝐛𝐨👊",
  " 📳𝐧𝐞𝐰 𝐧𝐮𝐦𝐛𝐞𝐫 𝐜𝐚𝐥𝐥 𝐝𝐞𝐮 01621251318😗🙍‍♂️",
  "🩹📳 𝐦𝐛 𝐧𝐚𝐢 𝐥𝐨𝐚𝐝 𝐝𝐢𝐛𝐚 𝐣𝐚𝐧 01621251318 𝐚𝐫𝐭𝐞𝐥 𝐬𝐢𝐦 500 𝐭𝐤 𝐥𝐨𝐚𝐝 𝐝𝐞𝐮🤗",
  "𝐬𝐡𝐮𝐧𝐥𝐚𝐦 𝐭𝐮𝐫 𝐧𝐚𝐤𝐢 𝐤𝐨𝐩𝐚𝐥𝐞 𝐭𝐚𝐤𝐥𝐚 𝐤𝐚𝐤𝐮 𝐩𝐨𝐫𝐬𝐞😹🫢",
  "𝐝𝐨𝐲𝐚 𝐝𝐢𝐥𝐚𝐦 𝐯𝐢𝐤𝐤𝐚 𝐤𝐨𝐫𝐞 𝐤𝐡𝐚𝐛𝐢😝😪",
  "𝐭𝐮𝐫 𝐧𝐚𝐧𝐚𝐫𝐞 𝐢 𝐥𝐨𝐯𝐞 𝐲𝐨𝐮😏😏",
  "𝐚𝐦𝐚𝐫 𝐛𝐨𝐬𝐬 𝐭𝐮𝐫𝐲 𝐥𝐢𝐤𝐞 𝐤𝐨𝐫𝐞🥺🥹",
  "𝐛𝐚𝐛𝐲 𝐧𝐚 𝐛𝐨𝐥𝐞 𝐚𝐦𝐫 𝐛𝐨𝐬𝐬 𝐫𝐨𝐜𝐤𝐲𝐫 𝐬𝐡𝐚𝐭𝐞 𝐦𝐨𝐧𝐝𝐢𝐫𝐚𝐫 𝐛𝐢𝐲𝐞 𝐭𝐚 𝐝𝐢𝐲𝐞 𝐝𝐞𝐮🙃🙂🌺",
  "𝐀𝐦𝐚𝐫 𝐛𝐨𝐬𝐬 𝐫𝐨𝐜𝐤𝐲𝐫 𝐬𝐡𝐚𝐭𝐞 𝐳𝐚𝐫𝐚 𝐛𝐚𝐛𝐲 𝐛𝐢𝐲𝐞 𝐭𝐚 𝐝𝐢𝐲𝐞 𝐝𝐞𝐧 𝐧𝐚🥺👊",
  "𝐛𝐚𝐛𝐮 𝐛𝐚𝐬𝐡 𝐤𝐡𝐚𝐛𝐚 𝐭𝐚𝐡𝐨𝐥𝐞 𝐢𝐧𝐛𝐨𝐱 𝐚 𝐧𝐨𝐤 𝐝𝐞𝐮😪🤧",
  "𝐛𝐛𝐲 𝐧𝐚 𝐛𝐨𝐥𝐞 𝐚𝐦𝐫 𝐛𝐨𝐬𝐬 𝐫𝐨𝐜𝐤𝐲 𝐤𝐞 𝐚𝐤𝐭𝐚 𝐠𝐨𝐟 𝐝𝐞🤓🧐",
  "𝐭𝐮𝐦𝐢 𝐤𝐞?🙍‍♂️❓",
  "𝐭𝐮𝐦𝐚𝐫 𝐢𝐧𝐭𝐫𝐨 𝐝𝐞𝐮👉😐"
  
];
 if (!arr) {

 await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
 if (!info) message.reply("info obj not found")
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID
 });
 }, event.messageID)
 }
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 a
 });
 }, event.messageID)
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};
