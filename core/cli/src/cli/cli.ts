import commander from 'commander';
import {version} from '../../package.json';
import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
})

export const program: (bumpSubcommand, initSubcommand) => (argv) => Promise<unknown> = (bumpSubcommand, initSubcommand) => async argv => {
    const program = new commander.Command();
    program.passCommandToAction(false);


    // Main Command
    program
        .version(version)
        .name('bumpup')

    program.command('bump', {isDefault: true})
        .description('bumps up the version')
        .option('-d, --dry', `executes all plugins in dry mode, preventing potentially destructive operations`, false)
        .option('-l, --log <log-level>', `specifies the log level (error, warn, info, verbose, debug, silly)`, parseLogLevelOption, 'info')
        .option('-f, --file <config-file>', `which config file to read`, 'bumpup.config.mjs')
        .action(bumpSubcommand)

    program.command('init')
        .option('-f, --file <config-file>', `which config file to write`, `bumpup.config.mjs`)
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
