import * as fs from 'fs';
import * as child_process from "child_process";
import winston from 'winston';
import symbols from 'log-symbols';
import {match} from "@bumpup/fp";

const COMMIT_SEPERATOR = `++COMMIT_SEPERATOR++`
const GIT_COMMAND = tag=> `git log ${tag}.. --pretty=format:%B${COMMIT_SEPERATOR} .`;

const type = options => data => {
    // Create Logger
    const logger = winston.createLogger({
        level: options.logLevel,
        format: winston.format.printf(({message}) => message),
        transports: [new winston.transports.Console()]
    });

    //Ensure git repo exists
    if (!fs.existsSync('.git')) {
        logger.error(`${symbols.error} .git directory doesn't exist`);
        return data;
    }

    //Check if tags exists
    const tagsRaw = child_process.execSync('git tag').toString();
    if(tagsRaw === ''){
        logger.info(`${symbols.info} no tags found`)
        return {...data, type: 'new'};
    }

    //If tags exists, find type
    const rawCommits = child_process.execSync(GIT_COMMAND(data.version)).toString();
    const type = determineHighestCommitType(getCommitTypes(parseCommitMessages(parseCommandLineOutput(rawCommits))))
    logger.info(`${symbols.info} change type is ${type}`)
    return {...data, type};
}

export const parseCommandLineOutput = (output: string): string[] => output.trim().split(COMMIT_SEPERATOR).slice(0, -1);

export const parseCommitMessage = (message: string): CommitMessage => {
    const msg: CommitMessage = {notes: []};
    msg.subject = message.trim().split(/(\r\n|\r|\n)/).filter(l => !(l === '' || l === '\n'))[0].replace(/.+:(.*)$/, "$1").trim();

    if (message.trim().startsWith('fix')) {
        msg.type = 'fix';
    } else if (message.trim().startsWith('feat')) {
        msg.type = 'feat';
    }
    if (message.includes('BREAKING CHANGE')) {
        msg.notes.push({title: 'BREAKING CHANGE', text: ''})
    }
    return msg;
};
export const parseCommitMessages = (messages: string[]): CommitMessage[] => messages.map(parseCommitMessage);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const getCommitType = (message: CommitMessage): CommitType => match([
    {test: message.notes?.map(note => note.title).includes('BREAKING CHANGE'), value: 'major'},
    {test: message.type === 'fix', value: 'patch'},
    {test: message.type === 'feat', value: 'minor'},
    {test: true, value: 'none'},
]);

export const getCommitTypes = (messages: CommitMessage[]): CommitType[] => messages.map(getCommitType)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const determineHighestCommitType = (types: CommitType[]): CommitType => types.reduce((acc, cur) => match([
    {test: acc === 'none', value: cur},
    {test: acc === 'patch' && cur !== 'none', value: cur},
    {test: acc === 'minor' && cur === 'major', value: cur},
    {test: acc === 'major', value: acc},
    {test: true, value: acc},
]), 'none');

export type CommitMessage = {
    body?: string,
    footer?: string,
    type?: string,
    scope?: string,
    subject?: string,
    header?: string,
    notes?: { title: string, text: string }[]
}

export type CommitType = 'major' | 'minor' | 'patch' | 'none';

export default type;
