import commander from 'commander';
import {init} from "../commands/init/init";
import {bump, LogLevel} from "../commands/bump/bump";
import {version} from '../../package.json';
import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
})

export const program: (argv) => Promise<unknown> = async argv => {
    const program = new commander.Command();
    program.passCommandToAction(false);


    // Main Command
    program
        .version(version)
        .name('bumpup')

    program.command('bump', {isDefault: true})
        .description('bumps up the version')
        .option<boolean>('-d, --dry', `executes all plugins in dry mode, preventing potentially destructive operations`, parseDefault, false)
        .option<LogLevel>('-l, --log <log-level>', `specifies the log level (error, warn, info, verbose, debug, silly)`, parseLogLevelOption, 'info')
        .option<string>('-f, --file <config-file>', `which config file to read`, parseDefault, 'bumpup.config.mjs')
        .action(bump)

    program.command('init')
        .option('-f, --file <config-file>', `which config file to write`, `bumpup.config.mjs`)
        .description('initializes a default config file')
        .action(init)

    return program.parseAsync(argv);
}

const parseEnumarableOption = (enumberable: unknown[]) => (value, prev) => {
    if (enumberable.includes(value)) {
        return value;
    }
    logger.warn(`loglevel "${value}" is invalid, instead the default "${prev}" will be used`)
    return prev;
}

const parseLogLevelOption = parseEnumarableOption(['error', 'warn', 'info', 'verbose', 'debug', 'silly']);

const parseDefault = (value, prev) => value;