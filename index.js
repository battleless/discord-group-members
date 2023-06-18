const {
    REST,
    Routes
} = require('discord.js');

const abbreviate = require('number-abbreviate');

const config = require('./config.json');

const rest = new REST({ version: '10' }).setToken(config.token);

setInterval(async () => {
    const fetched = await fetch(`https://groups.roblox.com/v1/groups/${config.group}`);

    if (fetched.status !== 200) return console.log(`${fetched.status}: ${fetched.statusText}`);

    const data = await fetched.json();
    const memberCount = data.memberCount;

    let value;

    if (config.abbreviate) {
        value = abbreviate(memberCount, 2).toUpperCase();
    } else if (!config.abbreviate) {
        value = memberCount.toLocaleString();
    };

    rest.patch(Routes.channel(config.channel), {
        body: {
            name: config.format.replace('{data}', value)
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => console.error(error));

    for (const [key, value] of Object.entries(process.memoryUsage())) {
        console.log(`${key}: ${value / 1000000}MB `)
    };
}, config.interval * 1000);