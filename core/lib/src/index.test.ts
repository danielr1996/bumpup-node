import {release, TypeReader, VersionBumper, VersionDeterminer, VersionReader, VersionRecorder} from './index';
import 'jest-chain';

describe('@bumpup/lib', () => {
    it('release calls each functions excatly once', () => {
        const getChangeType: TypeReader = jest.fn(lastVersion => 'fix');
        const getLastVersion: VersionReader = jest.fn(() => '1.0.0');
        const getNewVersionFromLastVersion = jest.fn(lastVersion => '1.0.1');
        const getNewVersion: VersionDeterminer = jest.fn(changeType => getNewVersionFromLastVersion);
        const bump: VersionBumper = jest.fn(version=>({status: '', message: ''}));
        const record: VersionRecorder = jest.fn(version=>({status: '', message: ''}));
        const rel = release(getLastVersion)(getChangeType)(getNewVersion)(bump)(record);
        rel();

        expect(getChangeType).toHaveBeenCalledTimes(1);
        expect(getLastVersion).toHaveBeenCalledTimes(1);
        expect(getNewVersion).toHaveBeenCalledWith('fix').toHaveBeenCalledTimes(1);
        expect(getNewVersionFromLastVersion).toHaveBeenCalledWith('1.0.0').toHaveBeenCalledTimes(1);
        expect(bump).toHaveBeenCalledWith('1.0.1').toHaveBeenCalledTimes(1)
        expect(record).toHaveBeenCalledWith('1.0.1').toHaveBeenCalledTimes(1)
    })
})
