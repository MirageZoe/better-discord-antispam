const { RichEmbed } = require("discord.js"); // Requiring this since we need it for embeds later

let authors = [];
let warned = [];
let punishedList = [];
let messageLog = [];

module.exports = async (client, options) => {
  /* Declaring our options which we are going to work on */
  
  const limitUntilWarn = (options && options.limitUntilWarn) || 3; // Default value: 3. Explication: This is the limit where you get the warn message. If the member X sent over 3 messages within the interval, he get warned
  const limitUntilMuted = (options && options.limitUntilMuted) || 5; // Default value: 5. Explication: This is the limit where you get Punished. If the member X sent over 5 messages within the interval, he get muted.
  const interval = (options && options.interval) || 2000; //Default Time: 2000MS (1000 milliseconds = 1 second, 2000 milliseconds = 2 seconds etc...). Explication: The interval where the messages are sent. Practically if member X sent 5+ messages within 2 seconds, he get muted
  const warningMessage = (options && options.warningMessage) || "if you don't stop from spamming, I'm going to punish you!"; // Default Message: if you don't stop from spamming, I'm going to punish you!. Explication: None, it's just a message you get for the warning phase.
  const muteMessage = (options && options.muteMessage) || "was muted since we don't like too much advertisement type people!"; // Default Message: "was muted since we don't like too much advertisement type people!". Explication: The message sent after member X was punished
  const maxDuplicatesWarning = (options && options.maxDuplicatesWarning || 7); // Default value: 7. Explication: When people are spamming the same message, <limitUntilWarn> is ignored and this will trigger when member X sent over 7+ message that are the same.
  const maxDuplicatesMute = (options && options. maxDuplicatesMute || 10); // Deafult value: 10 Explication: The limit where member X get muted after sending too many messages(10+).
  const ignoredRoles = (options && options.ignoredRoles) || []; // Default value: None. Explication: The members with this role(or roles) will be ignored if they have it. Suggest to not add this to any random guys.
  const ignoredMembers = (options && options.ignoredMembers) || []; // Default value: None. Explication: These members are directly affected and they do not require to have the role above. Good for undercover pranks.
  const mutedRole = (options && options.mutedRole) || "muted"; // Default value: muted. Explication: Here you put the name of the role that should not let people write/speak or anything else in your server. If there is no role set, by default, the module will attempt to create the role for you & set it correctly for every channel in your server. It will be named "muted".
  const timeMuted = (options && options.timeMuted) || 1000 * 600; // Default value: 10 minutes. Explication: This is how much time member X will be muted. if not set, default would be 10 min.
  const logChannel = (options && options.logChannel) || "AntiSpam-logs"; // Default value: "AhtiSpam-logs". Explication: This is the channel where every report about spamming goes to. If it's not set up, it will attempt to create the channel.

// If something is added wrong, throw an error

  if(isNaN(limitUntilWarn)) throw new Error("ERROR: <limitUntilWarn> option is not set up right! Please check it again to be a number in settings.");
  if(isNaN(limitUntilMuted)) throw new Error("ERROR: <limitUntilMuted> option is not set up right! Please add a number in settings.");
  if(isNaN(interval)) throw new Error("ERROR: <interval> option is not set up right! Please add a number in settings.");
  if(!isNaN(warningMessage) || warningMessage.length < 5) throw new Error("ERROR: <warningMessage> option must be a string and have at least 5 characters long (Including space).");
  if(!isNaN(muteMessage) || muteMessage.length < 5) throw new Error("ERROR: <muteMessage> option must be a string and have at least 5 characters long (Including space).");
  if(isNaN(maxDuplicatesWarning)) throw new Error("ERROR: <maxDuplicatesWarning> option is not set up right! Please check it again to be a number in settings.")
  if(isNaN(maxDuplicatesMute)) throw new Error("ERROR: <maxDuplicatesMute> option is not set up right! Please check it again to be a number in settings.");
  if(isNaN(timeMuted)) throw new Error("ERROR: <timeMuted> option is not set up right! Please check it again to be a number in settings.");
  if(ignoredRoles.constructor !== Array) throw new Error("ERROR: <ignoredRoles> option is not set up right! Please check it again to be an array in settings.");
  if(ignoredMembers.constructor !== Array) throw new Error("ERROR: <ignoredMembers> option is not set up right! Please check it again to be an array in settings.");
  
  // Custom 'checkMessage' event that handles messages
 client.on("checkMessage", async (message) => {
 
  //time variables
  let clock = new Date();
  let ss = String(clock.getSeconds()).padStart(2, '0');
  let min = String(clock.getMinutes()).padStart(2, '0');
  let hrs = String(clock.getHours()).padStart(1, '0');
  clock = hrs + ':' + min +':' + ss;

  let TheDate = new Date()
  let zilelesaptamanii = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let weekday = zilelesaptamanii[TheDate.getDay()];
  let dd = String(TheDate.getDate()).padStart(2, '0');
  let mon = String(TheDate.getMonth()+ 1);
  let year = String(TheDate.getFullYear()).padStart(4,'00');
  TheDate = weekday+", " + mon + '/' + dd +'/' + year;
  //end of time variables

  //verify if it's pm or AM
  let amORpm;
  if(hrs >= 0 && hrs <= 12){
      amORpm = "AM"
  }else{
      amORpm = "PM"
  };
  // The Mute function.
  const MuteMember = async (m, muteMsg) => {
    for (var i = 0; i < messageLog.length; i++) {
        if (messageLog[i].author == m.author.id) {
          messageLog.splice(i);
        }
      }
  
      punishedList.push(m.author.id);
      
      let user = m.guild.members.get(m.author.id);
      let ReportChannel = m.guild.channels.find(ch => ch.name === logChannel);
      if(!ReportChannel){
        try{
            ReportChannel = await m.guild.createChannel('AntiSpam-logs', {
              type: 'text',
              permissionOverwrites:[{
                id: m.guild.id,
                deny: ['VIEW_CHANNEL']
              }]
            })
              .then(m=> m.send(`Created **\`Anti-Spam-Logs\`** channel since a channel for reports wasn't provided from beginning when setting up the module.`))
              .catch(console.error)
  
        }catch(e){
          console.log(e.stack);
        }
      }; // end of creating the channel for anti spam logs

      let role = m.guild.roles.find(namae => namae.name === mutedRole);      
      if (!role) {
        try {
            role = await m.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions: []
            })
            m.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false
                });
            });
           ReportChannel.send(`Created **\`muted\`** role since a role(to be applied to muted person) wasn't provided from beginning when setting up the module.`) 
        } catch (e) {
            console.log(e.stack);
        }
    }//end of creating the role
    
      if (user) {
        user.addRole(role).then(()=>{
          m.channel.send(`<@!${m.author.id}>, ${muteMsg}`);
          let muteEmbed = new RichEmbed()
            .setAuthor(' Action | Auto Mute', `https://images-ext-2.discordapp.net/external/Wms63jAyNOxNHtfUpS1EpRAQer2UT0nOsFaWlnDdR3M/https/image.flaticon.com/icons/png/128/148/148757.png`)
            .addField('Member muted:',`${user}`)
            .addField(`How much time got muted?:`,`${timeMuted} seconds (10 min)`)
            .addField('Reason of mute: ', `Spam`)
            .addField(`When it was muted that person:`,TheDate+ " at "+ clock+" "+amORpm)
            .setColor('#D9D900')
          ReportChannel.send(muteEmbed);
          setTimeout(()=>{
            user.removeRole(role);
            let unmutedEmbed = new RichEmbed()
              .setAuthor('Action | Auto Unmute')
              .addField(`Member unmuted:`,`${user}`)
              .addField(`Reason of unmute:`,`Time Expired(10 min)`)
              .setColor('#D9D900')
          ReportChannel.send(unmutedEmbed)
          }, timeMuted);
          return true;
       }).catch((e) => {
          m.guild.owner.send(`Oops, seems like i don't have sufficient permissions to mute <@!${message.author.id}>!\n It can be that or another type of error happened! Tell me on github: https://github.com/MirageZoe/ \n Everything happened on ${TheDate} at ${clock} ${amORpm} with message:\n\n\`${e.message}\`\n\n *P.S: If this is the first time getting something like this, most likely because it was not set up good the log channel at beginning and didn't know where to send the reports. Do not panic, next time it will work since he created the channel where to send the reports!*`);
          return false;
      });
    }//end of user
  }
  
    
   // The warning function.
   const WarnMember = async (m, reply) => {
    warned.push(m.author.id);
    m.channel.send(`<@${m.author.id}>, ${reply}`);
   }

    if (message.author.bot) return;
    if (message.channel.type !== "text" || !message.member || !message.guild || !message.channel.guild) return;
   
    if (message.member.roles.some(r => ignoredRoles.includes(r.name)) || ignoredMembers.includes(message.author.tag)) return;

    if (message.author.id !== client.user.id) {
      let currentTime = Math.floor(Date.now());
      authors.push({
        "time": currentTime,
        "author": message.author.id
      });
      
      messageLog.push({
        "message": message.content,
        "author": message.author.id
      });
      
      let msgMatch = 0;
      for (var i = 0; i < messageLog.length; i++) {
        if (messageLog[i].message == message.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
          msgMatch++;
        }
      }
      
      if (msgMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
        WarnMember(message, warningMessage);
      }

      if (msgMatch == maxDuplicatesMute && !punishedList.includes(message.author.id)) {
        MuteMember(message, muteMessage);
      }

      var matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > currentTime - interval) {
          matched++;
          if (matched == limitUntilWarn && !warned.includes(message.author.id)) {
            WarnMember(message, warningMessage);
          } else if (matched == limitUntilMuted) {
            if (!punishedList.includes(message.author.id)) {
              MuteMember(message, muteMessage);
            }
          }
        } else if (authors[i].time < currentTime - interval) {
          authors.splice(i);
          warned.splice(warned.indexOf(authors[i]));
          punishedList.splice(warned.indexOf(authors[i]));
        }

        if (messageLog.length >= 200) {
          messageLog.shift();
        }
      }
    }
  });
}
