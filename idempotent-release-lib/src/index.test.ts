import {configure} from './index';

test('should return false given external link', () => {
    const fn = ()=>'1.1.0';
    const idr = configure(fn, fn, fn, fn);
    expect(idr()).toBe('1.1.0')
})
