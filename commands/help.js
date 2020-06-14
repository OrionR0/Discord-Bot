const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const reply = [];
        const { commands } = message.client;

        if (!args.length) {
            reply.push('Here\'s a list of all my commands:');
            reply.push(commands.map(cmd => cmd.name).join(', '));
            reply.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(reply, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        reply.push(`**Name:** ${command.name}`);

        if (command.aliases) reply.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) reply.push(`**Description:** ${command.description}`);
        if (command.usage) reply.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        reply.push(`**Cooldown:** ${command.cooldown || 0} second(s)`);

        message.channel.send(reply, { split: true });
	},
};