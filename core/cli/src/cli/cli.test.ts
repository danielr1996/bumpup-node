import {parseEnumarableOption, program} from "./cli";

describe('@bumpup/cli', () => {
    describe('cli', () => {
        describe('cli', () => {
            it('executes without errors', () => {
                const subcommand = console.log;
                expect(program(subcommand, subcommand, ()=>'1')([])).resolves.toBeTruthy();
            })
            it('doesnt report caught errors', () => {
                const subcommand = ()=>{
                    const error = new Error();
                    error['caught'] = true;
                    throw error;
                };
                expect(program(subcommand, subcommand, ()=>'1')([])).resolves.toBeTruthy();
            })
            it('reports uncaught errors', () => {
                const subcommand = ()=>{
                    throw new Error();
                };
                // program(subcommand, subcommand)([]).then(()=>console.log('success')).catch(()=>console.log('error'))
                expect(program(subcommand, subcommand, ()=>'1')([])).rejects.toBeTruthy();
                expect(program(subcommand, subcommand, ()=>'1')([])).resolves.toBeFalsy();
            })
        })
        describe('parseEnumberableOption', () => {
            it('returns value for valid option', () => {
                expect(parseEnumarableOption(['apple', 'orange'])('apple', 'orange')).toBe('apple');
            })

            it('returns default for invalid option', () => {
                expect(parseEnumarableOption(['apple', 'orange'])('banana', 'orange')).toBe('orange');
            })
        })
    })
})