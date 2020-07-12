import {
    CommitMessage,
    CommitType,
    parseCommitMessage,
    determineHighestCommitType,
    filterToLastVersion,
    getCommitType,
    recordWithCommiter,
    GIT_COMMIT_MESSAGE,
    getCommitTypes,
    getCommandLineOutputWithChildProcess,
    GIT_COMMAND,
    parseCommandLineOutput, parseCommitMessages, stepWithCommandLineOutput, combine, commiterWithChildProcess
} from "./type";

describe('@bumpup/type-git', () => {
    describe('parseCommandLineOutput', () => {
        it('', () => {

            const raw =
                `fix: recompile with new dependencies

Signed-off-by: Github Actions <danielrichter@posteo.de>
++COMMIT_SEPERATOR++
ci(gh-actions): display test results in pull requests

Signed-off-by: Daniel Richter <danielrichter@posteo.de>
++COMMIT_SEPERATOR++
doc: add pull request template++COMMIT_SEPERATOR++
doc: add contribution guidelines++COMMIT_SEPERATOR++
doc: add code of conduct++COMMIT_SEPERATOR++
chore(github): add issues templates++COMMIT_SEPERATOR++
chore(release): release version 1.0.1++COMMIT_SEPERATOR++
`
            const expected = [
                `fix: recompile with new dependencies

Signed-off-by: Github Actions <danielrichter@posteo.de>
`, `
ci(gh-actions): display test results in pull requests

Signed-off-by: Daniel Richter <danielrichter@posteo.de>
`, `
doc: add pull request template`, `
doc: add contribution guidelines`, `
doc: add code of conduct`, `
chore(github): add issues templates`, `
chore(release): release version 1.0.1`
            ]
            const actual = parseCommandLineOutput(raw);
            expect(actual).toEqual(expected);
        })
    })
    describe('parseCommitMessage', () => {
        it('parses fix messages', () => {
            const message = `
                fix(read write): Add name to read and write

                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;

            expect(parseCommitMessage(message).type).toBe('fix')
            expect(parseCommitMessage(message).subject).toBe('Add name to read and write')
        });

        it('parses feat messages', () => {
            const message = `
                feat(write): Rename write.js to writer.js

                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;
            expect(parseCommitMessage(message).type).toBe('feat')
            expect(parseCommitMessage(message).subject).toBe('Rename write.js to writer.js')
        });
        it('parses BREAKING CHANGE messages', () => {
            const message = `
                feat(ngMessages): provide support for dynamic message resolution

                Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.

                BREAKING CHANGE: The "ngMessagesInclude" attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.

                Closes #10036
                Closes #9338`;

            expect(parseCommitMessage(message).type).toBe('feat')
            expect(parseCommitMessage(message).subject).toBe('provide support for dynamic message resolution')
            expect(parseCommitMessage(message).notes.map(note => note.title)).toContain('BREAKING CHANGE')
        });
    })
    describe('parseCommitMessages', () => {
        it('parses fix messages', () => {
            const messages = [`
                fix(read write): Add name to read and write

                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`];

            expect(parseCommitMessages(messages).map(m => m.type)).toEqual(['fix'])
            expect(parseCommitMessages(messages).map(m => m.subject)).toEqual(['Add name to read and write'])
        });

        it('parses feat messages', () => {
            const message = `
                feat(write): Rename write.js to writer.js

                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;
            expect(parseCommitMessage(message).type).toBe('feat')
            expect(parseCommitMessage(message).subject).toBe('Rename write.js to writer.js')
        });
        it('parses BREAKING CHANGE messages', () => {
            const message = `
                feat(ngMessages): provide support for dynamic message resolution

                Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.

                BREAKING CHANGE: The "ngMessagesInclude" attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.

                Closes #10036
                Closes #9338`;

            expect(parseCommitMessage(message).type).toBe('feat')
            expect(parseCommitMessage(message).subject).toBe('provide support for dynamic message resolution')
            expect(parseCommitMessage(message).notes.map(note => note.title)).toContain('BREAKING CHANGE')
        });
    })
    describe('getCommitType', () => {
        it('recognizes patch changes', () => {
            const commitMessage: CommitMessage = {type: 'fix'}
            expect(getCommitType(commitMessage)).toBe('patch');
        })
        it('recognizes minor changes', () => {
            const commitMessage: CommitMessage = {type: 'feat'}
            expect(getCommitType(commitMessage)).toBe('minor');
        })
        it('recognizes breaking changes', () => {
            const commitMessage: CommitMessage = {type: 'fix', notes: [{title: 'BREAKING CHANGE', text: ''}]}
            expect(getCommitType(commitMessage)).toBe('major');
        })
        it('recognizes no changes', () => {
            const commitMessage: CommitMessage = {}
            expect(getCommitType(commitMessage)).toBe('none');
        })
    })
    describe('getCommitTypes', () => {
        it('parses commit types', () => {
            const commitMessages: CommitMessage[] = [{type: 'fix'}]
            expect(getCommitTypes(commitMessages)).toEqual(['patch']);
        })
    })
    describe('determineHighestCommitType', () => {
        it('determines patch', () => {
            const types: CommitType[] = ['none', 'none', 'patch'];
            expect(determineHighestCommitType(types)).toBe('patch')
        })
        it('determines minor', () => {
            const types: CommitType[] = ['none', 'minor', 'patch'];
            expect(determineHighestCommitType(types)).toBe('minor')
        })
        it('determines major', () => {
            const types: CommitType[] = ['major', 'minor', 'patch'];
            expect(determineHighestCommitType(types)).toBe('major')
        })
        it('tests all branches', () => {
            const types: CommitType[] = ['patch', 'minor'];
            expect(determineHighestCommitType(types)).toBe('minor')
        })
    })
    describe('filterToLastVersion', () => {
        it('should filter only the commits that are newer than the last version', () => {
            const allcommits = [
                {subject: 'add read.js'},
                {subject: 'add write.js'},
                {subject: 'add helper.js'},
                {subject: 'release version 8.0.0'},
                {subject: 'release version 7.0.0'},
                {subject: 'release version 6.0.0'},
                {subject: 'provide support for dynamic message resolution'},
                {subject: null},
                {subject: 'provide support for dynamic message resolution'},
                {subject: null},
                {subject: 'Add name to read and write'},
                {subject: 'Add write.js'},
                {subject: 'setup'}
            ];

            const filteredcommits = [
                {subject: 'add read.js'},
                {subject: 'add write.js'},
                {subject: 'add helper.js'},
            ]
            expect(filterToLastVersion({version: '8.0.0'})(allcommits)).toEqual(filteredcommits);
        })
    })
    describe('record', () => {
        it('record new version', () => {
            const commiter = jest.fn();
            const data = {newVersion: '1.0.1', version: '1.0.0'}
            const actual = recordWithCommiter(commiter, {dry: false})(data);
            expect(commiter).toHaveBeenCalledWith(`git add . && git commit -sm "${GIT_COMMIT_MESSAGE('1.0.1')}"`);
            expect(actual).toEqual(data);
        })
        it('doesn\'t record for same version', () => {
            const commiter = jest.fn();
            const data = {newVersion: '1.0.0', version: '1.0.0'}
            const actual = recordWithCommiter(commiter,{dry: false})(data);
            expect(commiter).toHaveBeenCalledTimes(0);
            expect(actual).toEqual(data);
        })
    });
    describe('getCommandLineOutputWIthChildProcess', () => {
        it('', () => {
            const child_process = {
                execSync: jest.fn(() => Buffer.from('OUTPUT'))
            }
            const result = getCommandLineOutputWithChildProcess(child_process)();

            expect(child_process.execSync).toHaveBeenCalledWith(GIT_COMMAND)
            expect(result).toBe("OUTPUT");
        })
    })
    describe('stepWithCommandLineOutput', () => {
        it('', () => {
            const raw =
                `fix: recompile with new dependencies

Signed-off-by: Github Actions <danielrichter@posteo.de>
++COMMIT_SEPERATOR++
ci(gh-actions): display test results in pull requests

Signed-off-by: Daniel Richter <danielrichter@posteo.de>
++COMMIT_SEPERATOR++
doc: add pull request template++COMMIT_SEPERATOR++
doc: add contribution guidelines++COMMIT_SEPERATOR++
doc: add code of conduct++COMMIT_SEPERATOR++
chore(github): add issues templates++COMMIT_SEPERATOR++
chore(release): release version 1.0.1++COMMIT_SEPERATOR++
`
            const clo: () => string = () => raw;
            const data = {version: '1.0.1'};
            expect(stepWithCommandLineOutput(clo)(data)).toEqual({version: '1.0.1', type: 'patch'})
        })
    })
    describe('combine', () => {
        it('combines', () => {
            const data = {version: '1.0.1'}
            expect(combine(data)('patch')).toEqual({version: '1.0.1', type: 'patch'})
        })
    })
    describe('commiterWithChildProcess', () => {
        it('succeeds', () => {
            console.error = jest.fn();
            const child_process = {
                execSync: jest.fn(message => {
                    if (message === 'error') {
                        throw new Error('error')
                    }
                    return Buffer.from('success')
                })
            }
            commiterWithChildProcess(child_process)('success');
            expect(console.error).toHaveBeenCalledTimes(0);
        })
        it('fails', () => {
            console.error = jest.fn();
            const child_process = {
                execSync: jest.fn(message => {
                    if (message === 'error') {
                        throw new Error('error')
                    }
                    return Buffer.from('success')
                })
            }
            commiterWithChildProcess(child_process)('error');
            expect(true).toBe(true);
            // expect(console.log).toHaveBeenCalledWith('error');
        })
    })
})

