import * as child_process from "child_process";
// @ts-ignore
import {flow, match, debug} from "idempotent-release-fp/dist/index.cjs";
import * as conventionalCommitsParser from 'conventional-commits-parser';
import fs from "fs";

const COMMIT_SEPERATOR = `++COMMIT_SEPERATOR++`
const GIT_COMMAND = `git log --pretty=format:%B${COMMIT_SEPERATOR} .`;
const GIT_COMMIT_MESSAGE =(newVersion)=>`chore(release): release version ${newVersion}`;

export type CommitMessage = {
    type?: string,
    scope?: string,
    subject?: string | null,
    header?: string,
    notes?: [{ title: string, text: string }]
}

export type CommitType = 'major' | 'minor' | 'patch' | 'none';

export const getCommandLineOutput = (): string => child_process.execSync(GIT_COMMAND).toString();

export const parseCommandLineOutput = (output: string): string[] => output.trim().split(COMMIT_SEPERATOR).slice(0, -1);

export const parseCommitMessage = (message: string): CommitMessage => {
    try {
        return conventionalCommitsParser.sync(message)
    } catch (e) {
        console.log('Error for commit ' + message)
        return {};
    }
};
export const parseCommitMessages = (messages: string[]): CommitMessage[] => messages.map(parseCommitMessage);

export const filterToLastVersion = (lastVersion: string) => (messages: CommitMessage[]) => {
    let filtered: CommitMessage[] = [];
    for(let message of messages){
        if(message.subject !== GIT_COMMIT_MESSAGE(lastVersion)){
            filtered.push(message);
            break;
        }
    }
    return filtered;
};

export const getCommitType = (message: CommitMessage): CommitType => match([
    {test: message.notes?.map(note => note.title).includes('BREAKING CHANGE'), value: 'major'},
    {test: message.type === 'fix', value: 'patch'},
    {test: message.type === 'feat', value: 'minor'},
    {test: true, value: 'none'},
]);

export const getCommitTypes = (messages: CommitMessage[]): CommitType[] => messages.map(getCommitType)

export const determineHighestCommitType = (types: CommitType[]): CommitType => types.reduce((acc, cur) => match([
    {test: acc === 'none', value: cur},
    {test: acc === 'patch' && cur !== 'none', value: cur},
    {test: acc === 'minor' && cur === 'major', value: cur},
    {test: acc === 'major', value: acc},
    {test: true, value: acc},
]), 'none')

export const getType = lastVersion => flow(
    getCommandLineOutput,
    parseCommandLineOutput,
    parseCommitMessages,
    filterToLastVersion(lastVersion),
    getCommitTypes,
    determineHighestCommitType,
)(lastVersion);


export const record = newVersion => {
    if(newVersion!==null){
        console.log('Recording version ',newVersion);
        child_process.execSync((`git add . && git commit -m "${GIT_COMMIT_MESSAGE(newVersion)}"`))
    }else{
        console.log('Nothing changed. Not recording.');
    }
}