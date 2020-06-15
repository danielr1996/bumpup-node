import {CommitMessage, CommitType, determineHighestCommitType, getCommitType} from "./index";

describe('idempotent-release-change-type-git', ()=>{
    describe('getCommitType',()=>{
        it('recognizes patch changes', ()=>{
            const commitMessage: CommitMessage = {type: 'fix'}
            expect(getCommitType(commitMessage)).toBe('patch');
        })
        it('recognizes minor changes', ()=>{
            const commitMessage: CommitMessage = {type: 'feat'}
            expect(getCommitType(commitMessage)).toBe('minor');
        })
        it('recognizes breaking changes', ()=>{
            const commitMessage: CommitMessage = {type: 'fix', notes:[{title:'BREAKING CHANGE', text:''}]}
            expect(getCommitType(commitMessage)).toBe('major');
        })
        it('recognizes no changes', ()=>{
            const commitMessage: CommitMessage = {}
            expect(getCommitType(commitMessage)).toBe('none');
        })
    })
    describe('determineHighestCommitType', ()=>{
        it('determines patch', ()=>{
            const types: CommitType[] = ['none','none','patch'];
            expect(determineHighestCommitType(types)).toBe('patch')
        })
        it('determines minor', ()=>{
            const types: CommitType[] = ['none','minor','patch'];
            expect(determineHighestCommitType(types)).toBe('minor')
        })
        it('determines major', ()=>{
            const types: CommitType[] = ['major','minor','patch'];
            expect(determineHighestCommitType(types)).toBe('major')
        })
    })
})