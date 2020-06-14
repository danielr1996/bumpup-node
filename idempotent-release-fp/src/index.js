export const lift2 = f => g => h => x => f(g(x))(h(x));
export const lift = f => g => h => () => f(g())(h());
export const trace = fn => x => fn(x);
export const debug = trace(console.log);
export const flow = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
