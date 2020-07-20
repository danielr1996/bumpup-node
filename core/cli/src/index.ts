/* istanbul ignore file */
import {program} from './cli/cli';
import {init} from "./commands/init/init";
import {bump} from "./commands/bump/bump";

program(bump, init)(process.argv).then();
