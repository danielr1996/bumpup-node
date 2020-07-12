// eslint-disable-next-line no-undef
module.exports = {
    presets: [
        '@babel/preset-typescript',
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '10',
                },
            },
        ],
    ],
};