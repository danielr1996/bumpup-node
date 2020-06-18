import {CommitMessage, CommitType, parseCommitMessage, determineHighestCommitType, filterToLastVersion, getCommitType} from "./index";

describe('@bumpup/type-git', () => {
    describe('parseCommitMessage', () => {
        it('parses fix messages', ()=>{
            const message = `
                fix(read write): Add name to read and write

                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;

            expect(parseCommitMessage(message).type).toBe('fix')
            expect(parseCommitMessage(message).subject).toBe('Add name to read and write')
        });

        it('parses feat messages', ()=>{
            const message = `
                feat(write): Rename write.js to writer.js

                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;
            expect(parseCommitMessage(message).type).toBe('feat')
            expect(parseCommitMessage(message).subject).toBe('Rename write.js to writer.js')
        });
        it('parses BREAKING CHANGE messages', ()=>{
            const message =`
                feat(ngMessages): provide support for dynamic message resolution

                Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.

                BREAKING CHANGE: The "ngMessagesInclude" attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.

                Closes #10036
                Closes #9338`;

            expect(parseCommitMessage(message).type).toBe('feat')
            expect(parseCommitMessage(message).subject).toBe('provide support for dynamic message resolution')
            expect(parseCommitMessage(message).notes.map(note=>note.title)).toContain('BREAKING CHANGE')
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
            expect(filterToLastVersion('8.0.0')(allcommits)).toEqual(filteredcommits);
        })
    })
})
