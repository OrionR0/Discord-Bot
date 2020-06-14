const { prefix } = require('../config.json');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	aliases: ['refresh'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
        if (!args.length) return message.reply("you didn't pass any command to reload.");
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.reply(`there is no command with name or alias \`${commandName}\`.`);

        delete require.cache[require.resolve(`./${command.name}.js`)];
        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.reply(`\`${command.name}\` was reloaded.`);
        } catch (error) {
            console.log(error);
            message.reply(`there was an error while reloading the command \`${command.name}\`:\n\`${error.message}\``);
        }
	},
};