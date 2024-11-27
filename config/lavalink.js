module.exports = {
    nodes: [
        {
            authorization: process.env.LAVALINK_PASSWORD,
            host: process.env.LAVALINK_HOST,
            port: parseInt(process.env.LAVALINK_PORT),
            id: "Soundhub",
        }
    ],
    autoSkip: true,
};