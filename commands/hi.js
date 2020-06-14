module.exports = {
    name: 'hi',
    description: 'Say hello!',
    aliases: ['hello', 'greet'],
    execute(message, args) {
        message.reply("Hello, " + message.author.username + "!");
    }
}