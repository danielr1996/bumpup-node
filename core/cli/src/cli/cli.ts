import commander from 'commander';
import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
})

export const program: (bumpSubcommand, initSubcommand, versionCommand) => (argv) => Promise<unknown> = (bumpSubcommand, initSubcommand, versionCommand) => async argv => {
    const program = new commander.Command();
    program.passCommandToAction(false);


    // Main Command
    program
        .version(versionCommand)
        .name('bumpup')

    program.command('bump', {isDefault: true})
        .description('bumps up the version')
        .option('-d, --dry', `executes all plugins in dry mode, preventing potentially destructive operations`, false)
        .option('-p, --pre', `do a prerelease`, false)
        .option('-l, --log <log-level>', `specifies the log level (error, warn, info, verbose, debug, silly)`, parseLogLevelOption, 'info')
        .option('-f, --file <config-file>', `which config file to read`, 'bumpup.config.mjs')
        .action(bumpSubcommand)

    program.command('init')
        .option('-f, --file <config-file>', `which config file to write`, `bumpup.config.mjs`)
        .option('-d, --dry', `executes all plugins in dry mode, preventing potentially destructive operations`, false)
        .option('-P, --save-prod', 'packages will appear in your `dependencies`', false)
        .option('-s, --skip-install', 'skip install of packages', false)
        .description('initializes a default config file')
        .action(initSubcommand)
    return program.parseAsync(argv);
}

export const parseEnumarableOption: (enumberable: unknown[]) => (value: unknown, previous: unknown) => unknown = enumberable => (value, prev) => {
    if (enumberable.includes(value)) {
        return value;
    }
    logger.warn(`option "${value}" is invalid, instead the default "${prev}" will be used`)
    return prev;
}

export const parseLogLevelOption = parseEnumarableOption(['error', 'warn', 'info', 'verbose', 'debug', 'silly']);
