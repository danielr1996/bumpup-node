import {flow, FunctionalInterface, match} from "./index";


describe("@bumpup/fp", () => {
    describe('flow', () => {
        it("pipes functions", () => {
            const fn1 = (val: string) => `fn1(${val})`;
            const fn2 = (val: string) => `fn2(${val})`;
            const fn3 = (val: string) => `fn3(${val})`;

            const pipedFunction = flow(fn1, fn2, fn3);
            expect(pipedFunction("inner")).toBe("fn3(fn2(fn1(inner)))");
        });
        it('does mathematical operations', () => {
            const toStr = (num: number): string => num.toString();
            const toNum = (str: string): number => parseInt(str);
            const multiply = (by: number) => (x: number) => x * by;
            const add = (plus: number) => (x: number) => x + plus;
            const double: (x: number) => number = multiply(2);
            const increment = add(1);

            const pipedFunction = flow(toNum, add(2), double, add(4), increment, toStr);
            expect(pipedFunction("1")).toBe("11");
        })
        it('accept a first function with no arguments', ()=>{
            const first: FunctionalInterface<void, string> = ()=>'first';
            const second = str=>str+'second';
            const third = str=>str+'third';

            const actual = flow(first, second, third)();
            const expected = 'firstsecondthird';
            expect(actual).toBe(expected);
        })
        it('accept a second function with no arguments', ()=>{
            const first = ()=>'first';
            const second = ()=>'second';
            const third = str=> {
                if(!str){
                    console.log(str);
                }
            };

            const actual = flow(first, second, third)();
            const expected = undefined;
            expect(actual).toBe(expected);
        })
    })
    // describe('lift', () => {
    //     it('lifts functions without arguments', () => {
    //         const firstname = () => 'John';
    //         const lastname = () => 'Doe';
    //         const greet = firstname => lastname => `Hello ${firstname} ${lastname}`;
    //         const lifted = lift(greet)(firstname)(lastname);
    //         expect(lifted()).toBe('Hello John Doe')
    //     })
    // })
    describe('match', () => {
        it('with no tests', () => {
            expect(match([])).toBe(null);
        })
        it('with no matches', () => {
            expect(match([
                {test: false, value: 'test'}
            ])).toBe(null);
        })
        it('with exactly 1 match', () => {
            expect(match([
                {test: 1 > 2, value: 1},
                {test: 2 > 1, value: 2},
                {test: false, value: 3},
            ])).toBe(2);
        })
        it('with more than 1 match', () => {
            expect(match([
                {test: true, value: 1},
                {test: true, value: 2},
                {test: true, value: 3},
            ])).toBe(1);
        })
    })
});
