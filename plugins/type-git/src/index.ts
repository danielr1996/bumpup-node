import * as child_process from "child_process";
import {flow, match} from "@bumpup/fp";
import {BumpupData} from "@bumpup/lib";

const COMMIT_SEPERATOR = `++COMMIT_SEPERATOR++`
const GIT_COMMAND = `git log --pretty=format:%B${COMMIT_SEPERATOR} .`;
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

export const getCommandLineOutput = (): string => child_process.execSync(GIT_COMMAND).toString();

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

export const filterToLastVersion = (lastVersion: string) => (messages: CommitMessage[]): CommitMessage[] => {
    const filtered: CommitMessage[] = [];
    for (const message of messages) {
        if (message.subject === GIT_COMMIT_SUBJECT(lastVersion)) {
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
]), 'none')

export const step = (data: BumpupData): BumpupData => flow(
    getCommandLineOutput,
    parseCommandLineOutput,
    parseCommitMessages,
    filterToLastVersion(data.version),
    getCommitTypes,
    determineHighestCommitType,
    type => ({...data, type}),
)(data);
export type Commiter = (message: string) => void;
export const commiter = (message: string): void => {
    try {
        child_process.execSync(message)
    } catch (e) {
        console.error(e)
    }
}

export const recordWithCommiter = (commiter: Commiter) => (data: BumpupData): BumpupData => {
    if (data.newVersion !== data.version) {
        commiter(`git add . && git commit -sm "${GIT_COMMIT_MESSAGE(data.newVersion)}"`);
    }
    return data;
}
export const record = recordWithCommiter(commiter);
