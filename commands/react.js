module.exports = {
    name: 'react',
    description: 'React to the message!',
    usage: '😊',
    args: true,
    execute(message, args) {
        message.react(args[0]);
    }
}