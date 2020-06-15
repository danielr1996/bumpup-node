export const lift = f => g => h => () => f(g())(h());
export const trace = fn => x => {
    fn(x);
    return x;
};
export const log = message => trace(x => console.log(`${message}: ${x}`))
export const debug = trace(console.log);
export const flow = (...fns: ((any) => any)[]) => fns.reduce((f, g) => (...args) => g(f(...args)));
export const match = (tests: { test: boolean | undefined, value: any }[]) => {
    const results = tests.filter(test => test.test);
    return results.length>0 ? results[0].value : null;
}