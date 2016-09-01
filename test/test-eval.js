import {expression} from '../';


describe('expression.eval', function() {

    it('simple literal', () => {
        var ctx = {};

        expect(expression('"ciao"').eval(ctx)).toBe('ciao');
    });


    it('member expression', () => {
        var ctx = {
            foo: 'ciao',
            pippo: {
                bla: 12345,
                more: {
                    name: 'pluto'
                }
            }
        };

        expect(expression('foo').eval(ctx)).toBe('ciao');
        expect(expression('foo.bla').eval(ctx)).toBe(undefined);
        expect(expression('pippo.more.name').eval(ctx)).toBe('pluto');
    });

    it('call expression', () => {
        var ctx = {
            random: () => {
                return Math.random();
            },
            self: function () {
                return this;
            },
            nested: {
                bla: function () {
                    return this;
                },
                foo: function () {
                    return 'OK';
                },
                set: function (v1, v2) {
                    this.v1 = v1;
                    this.v2 = v2;
                    return 'SET';
                }
            }
        };

        expect(expression('random()').eval(ctx)).toBeGreaterThan(0);
        expect(expression('self()').eval(ctx)).toBe(ctx);
        expect(expression('nested.bla()').eval(ctx)).toBe(ctx.nested);
        expect(expression('nested.bla().foo()').eval(ctx)).toBe('OK');
        expect(expression('nested.bla().set(0, "sun")').eval(ctx)).toBe('SET');
        expect(ctx.nested.v1).toBe(0);
        expect(ctx.nested.v2).toBe("sun");

        expect(expression('nested.bla().set(random(), nested.foo())').eval(ctx)).toBe('SET');
        expect(ctx.nested.v1).toBeGreaterThan(0);
        expect(ctx.nested.v2).toBe("OK");
    });

});
