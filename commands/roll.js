const rand = require('../utils/rand.js');
const config = require('../config.json');

module.exports = {
    name: 'roll',
    description: 'Roll dice!',
    usage: '2d6',
    args: true,
    execute(message, args) {
        let diceRegExp = new RegExp("^[1-9][0-9]*d[0-9]*$");
        if (diceRegExp.test(args[0])) {
            let diceDef = args[0].split('d');
            let nDice = diceDef[0];
            let nSides = diceDef[1];
            let dieResult = rand.intBetween(1, nSides);
            if (nDice > 1) {
                let diceText = dieResult;
                let rollResult = dieResult;
                for (let i = 1; i < nDice; i++) {
                    dieResult = rand.intBetween(1, nSides);
                    diceText += ' + ' + dieResult;
                    rollResult += dieResult;
                }
                diceText += ' = ' + rollResult;
                message.reply(diceText);
            } else {
                message.reply(dieResult);
            }
        } else {
            message.reply(`What dice did you want to use? Example: ${config.prefix}roll 2d6`);
        }
    }
}