# better-discord-antispam.js
A simple module based on Michael Scofield's module: discord-anti-spam.js! While containing the same efficiency(quick and simple setup), it comes with new things like setting up a report channel, timed mutes(removed ban option and added mute & unmute automatically) and many more features coming on the way!

**DISCLAMER:** You can only setup 1 set of configuration per client. (That means that you can't configure settings for each server for now. You can only modify in which guild checker is run and in which checker is not run.) 


## How to add this to your node_modules:
To install this module type in your console command below:
```
npm i better-discord-antispam
```

## An example of how to set up:
Below you will find an example that would explain everything and what you must set up! (it's not too different!)

```js
const Discord = require('discord.js');
const antispam = require('better-discord-antispam'); // Requiring this module.
const client = new Discord.Client();

client.on('ready', () => {
  // Module Configuration Constructor
   antispam(client, {
        limitUntilWarn: 3, // The amount of messages allowed to send within the interval(time) before getting a warn.
        limitUntilMuted: 5, // The amount of messages allowed to send within the interval(time) before getting a muted.
        interval: 2000, // The interval(time) where the messages are sent. Practically if member X sent 5+ messages within 2 seconds, he get muted. (1000 milliseconds = 1 second, 2000 milliseconds = 2 seconds etc etc)
        warningMessage: "if you don't stop from spamming, I'm going to punish you!", // Message you get when you are warned!
        muteMessage: "was muted since we don't like too much advertisement type people!", // Message sent after member X was punished(muted).
        maxDuplicatesWarning: 7,// When people are spamming the same message, this will trigger when member X sent over 7+ messages.
        maxDuplicatesMute: 10, // The limit where member X get muted after sending too many messages(10+).
        ignoredRoles: ["Admin"], // The members with this role(or roles) will be ignored if they have it. Suggest to not add this to any random guys. Also it's case sensitive.
        ignoredMembers: ["Mavis#2389"], // These members are directly affected and they do not require to have the role above. Good for undercover pranks.
		mutedRole: "muted", // Here you put the name of the role that should not let people write/speak or anything else in your server. If there is no role set, by default, the module will attempt to create the role for you & set it correctly for every channel in your server. It will be named "muted".
		timeMuted: 1000 * 600, // This is how much time member X will be muted. if not set, default would be 10 min.
		logChannel: "AntiSpam-logs" // This is the channel where every report about spamming goes to. If it's not set up, it will attempt to create the channel.
      });
      
  // Rest of your code
});

client.on('message', msg => {
  client.emit('checkMessage', msg); // This runs the filter on any message bot receives in any guilds.
  
  // Rest of your code
}

client.login('token');
```
This is the main setup you have to add in order to protect your server from unwanted people. If they send more than 3 messages within 2 seconds, they get warned. At 5 they get muted. If they send same message 7+ times, he get warned and at 10 muted. Every member from <ignoredMembers> option and everyone that has the role/roles from <ignoredRoles> are protected from system so they can spam as much as they want.

## Little bit of documentation...

```js
antispam(<Client>);
```
This will configure module to run on its default configuration.<br>
`<Client>` - Variable that defines `new Discord.Client()`<br>
`antispam` - Variable that defines `require('better-discord-antispam')` <br>
<br>
```js
client.emit('checkMessage', <Message>)
```
`<Message>` - Variable that defines the message itself. (`client.on('message', async (msg) =>{})` in this situation msg is the <Message> variable.)
This will basically send your message to module. In fact is REQUIERED for module to run.<br>
<br>
```js
antispam(client, {
        limitUntilWarn: 3,
        limitUntilMuted: 5,
        interval: 2000,
        warningMessage: "",
        muteMessage: "",
        maxDuplicatesWarning: 7,
        maxDuplicatesMute: 10,
        ignoredRoles: [],
        ignoredMembers: [],
		mutedRole:"",
		timeMuted: 1000*600,
		logChannel: ""
      });
```
`antispam` - Variable that defines `require('better-discord-anti-spam')` <br>
`<Client>` - Requiered, Discord.Client<br>
`limitUntilWarn` - Optional, Type: Integer<br>
`limitUntilMuted` - Optional, Type: Integer<br>
`interval` - Optional, Type: Integer<br>
`warningMessage` - Optonal, Type: String, Minimum 5 Characters<br>
`muteMessage` - Optional, Type: String, Minimum 5 Characters<br>
`maxDuplicatesWarning` - Optional, Type: Integer<br>
`maxDuplicatesMute` - Optional, Type: Integer<br>
`ignoredRoles` - Optional, Type: Array<br>
`ignoredMembers`- Optional, Type: Array<br>
`mutedRole`- Optional, Type: String<br>
`timeMuted`- Optional, Type: Integer<br>
`logChannel`- Optional, Type: String<br>
<br>
**NOTE:** The module **will** throw errors for assigning incorect types to configuration values.<br>
<br>

P.S: If you have any issues, bugs or trouble setting the module up. feel free to open an issue on [Github](https://github.com/MirageZoe/better-discord-antispam)

P.S 2: This is just a release that is modified by me to suit the best my needs. If you find it on your taste, I'm happy. I'm not about to add complicated things only if I need them.
