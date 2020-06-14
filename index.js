const fs = require('fs');
const winston = require('winston');
const Discord = require('discord.js');

const config = require('./config.json');
const auth = require('./auth.json');

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({ level: 'debug', format: winston.format.colorize() }),
    ],
});
process.on('unhandledRejection', error => logger.error('Uncaught Promise Rejection', error));

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

logger.debug('Connecting client');
client.login(auth.token);
client.on('ready', function (evt) {
    logger.info('Logged in as: ' + client.user.tag);
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    logger.debug(`Running ${message.author.tag}'s command: ${message.content}`);
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.cooldown) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
    }

    if (command.args && !args.length) {
        let reply = "Command requires arguments.";
        if (command.usage) {
            reply += `\nExample usage: \`${config.prefix}${command.name} ${command.usage}\``;
        }
        return message.reply(reply);
    }
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute this command inside DMs!');
    }
    try {
        command.execute(message, args);
    } catch (error) {
        logger.error(error);
        message.reply('There was an error executing command ' + commandName);
    }
});