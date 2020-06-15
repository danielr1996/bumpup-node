import {CommitMessage, CommitType, determineHighestCommitType, filterToLastVersion, getCommitType} from "src/index";

describe('idempotent-release-change-type-git', () => {
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
                {subject: 'add helper.js'},
            ]
            expect(filterToLastVersion('8.0.0')(allcommits)).toEqual(filteredcommits);
        })
    })
})
