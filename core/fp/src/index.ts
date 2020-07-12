export type FunctionalInterface<T, R> = (t?: T) => R | void | undefined

// export const lift = (f: FunctionalInterface<unknown, unknown>) => (g: FunctionalInterface<unknown, unknown>) => (h: FunctionalInterface<unknown, unknown>) => () => {
//     const gResult = g();
//
//     return f(gResult)(h());
// };
export const trace = <T>(fn: FunctionalInterface<T, void>) => (x: T): T => {
    fn(x);
    return x;
};

export const debug = trace(console.log);

export const flow = (...fns: FunctionalInterface<unknown, unknown>[]): FunctionalInterface<unknown, unknown> => fns.reduce((f, g) => (...args) => g(f(...args)));
export const pipe = (...fns: FunctionalInterface<unknown, unknown>[]): FunctionalInterface<unknown, unknown> => input => fns.reduce((f, g) => f.then(g), Promise.resolve(input));
export const match = <R>(tests: { test: boolean, value: R }[]): R => {
    const results = tests.filter(test => test.test);
    return results.length > 0 ? results[0].value : null;
}

export const emoji = (emoji: TemplateStringsArray): string => process.platform === "win32" ? '✔' : emoji[0];