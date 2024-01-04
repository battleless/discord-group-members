const {
    REST,
    Routes
} = require('discord.js');

const abbreviate = require('number-abbreviate');

const config = require('./config.json');

const rest = new REST({
    version: '10'
}).setToken(config.token);

setInterval(async () => {
    const fetched = await fetch(`https://groups.roblox.com/v1/groups/${config.group}`);

    if (fetched.status !== 200) {
        throw new Error(`${fetched.status}: ${fetched.statusText}`);
    }

    const data = await fetched.json();
    const memberCount = data.memberCount;

    let value;

    if (config.abbreviate) {
        value = abbreviate(memberCount, 2).toUpperCase();
    } else {
        value = memberCount.toLocaleString();
    };

    await rest.patch(Routes.channel(config.channel), {
        body: {
            name: config.format.replace('{data}', value)
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => console.error);
}, config.interval * 1000);
