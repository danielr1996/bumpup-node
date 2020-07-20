import * as child_process from "child_process";
import {emoji, flow, match, trace} from "@bumpup/fp";
import {BumpupData, BumpupPlugin} from "@bumpup/lib";
import winston from 'winston';
import symbols from 'log-symbols';

const COMMIT_SEPERATOR = `++COMMIT_SEPERATOR++`
export const GIT_COMMAND = `git log --pretty=format:%B${COMMIT_SEPERATOR} .`;
export const GIT_COMMIT_MESSAGE = (newVersion: string): string => `chore(release): ${GIT_COMMIT_SUBJECT(newVersion)}`;
const GIT_COMMIT_SUBJECT = (newVersion: string): string => `release version ${newVersion}`;

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

export const getCommandLineOutputWithChildProcess = (cp: { execSync: (string) => Buffer }) => (): string => cp.execSync(GIT_COMMAND).toString();
export const getCommandLineOutput = getCommandLineOutputWithChildProcess(child_process);

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

export const filterToLastVersion = (data: BumpupData) => (messages: CommitMessage[]): CommitMessage[] => {
    const filtered: CommitMessage[] = [];
    for (const message of messages) {
        if (message.subject === GIT_COMMIT_SUBJECT(data.version)) {
            break;
        }
        filtered.push(message);
    }
    return filtered;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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

export const combine = (data: BumpupData) => (type: string): BumpupData => ({...data, type})

export const stepWithCommandLineOutput = (options: { logLevel: string, dry?: boolean })=>(clo: () => string) => (data: BumpupData): BumpupData => flow(
    clo,
    parseCommandLineOutput,
    parseCommitMessages,
    filterToLastVersion(data),
    getCommitTypes,
    determineHighestCommitType,
    combine(data),
    (()=>{
        const logger = winston.createLogger({
            level: options.logLevel,
            format: winston.format.printf(({message}) => message),
            transports: [new winston.transports.Console()]
        })
        return trace((data: BumpupData) => logger.info(`${symbols.info} change type is ${data.type}`))
    })()
)(data);
export const step: BumpupPlugin = (options: { logLevel: string, dry?: boolean }) => stepWithCommandLineOutput(options)(getCommandLineOutput);
export type Commiter = (message: string) => void;
export const commiterWithChildProcess = (cp: { execSync: (string) => Buffer }) => (message: string): void => {
    try {
        cp.execSync(message)
    } catch (e) {
        console.error(e)
    }
}
export const commiter = commiterWithChildProcess(child_process);

export const recordWithCommiter = (commiter: Commiter, options: { logLevel: string, dry?: boolean }) => (data: BumpupData): BumpupData => {
    const logger = winston.createLogger({
        level: options.logLevel,
        format: winston.format.printf(({message}) => message),
        transports: [new winston.transports.Console()]
    })
    if (data.newVersion !== data.version) {
        if(!options.dry){
            commiter(`git add . && git commit -sm "${GIT_COMMIT_MESSAGE(data.newVersion)}"`);

        }else{
            logger.warn(`${symbols.warning} Not Recording because the 'dry' option was specified`)
        }
    }else{
        logger.info(`${symbols.info} not recording version in git`)
    }
    return data;
}
export const record: (options: { logLevel: string, dry?: boolean }) => (BumpupData) => BumpupData = options => recordWithCommiter(commiter, options);
