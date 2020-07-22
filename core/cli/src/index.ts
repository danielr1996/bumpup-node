/* istanbul ignore file */
import {program} from './cli/cli';
import {init} from "./commands/init/init";
import {bump} from "./commands/bump/bump";
import {version} from "./commands/version/version";

program(bump, init, version(process.argv[1]))(process.argv).then();
