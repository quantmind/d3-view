import './utils';
import {viewExpression} from '../index';
import {viewProviders} from '../index';


var logger = viewProviders.logger;


describe('viewExpression.eval', function() {

    var ctx = {
        foo: 'ciao',
        pippo: {
            bla: 12345,
            more: {
                name: 'pluto'
            }
        },
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


    it('simple literal', () => {

        expect(viewExpression('"ciao"').eval(ctx)).toBe('ciao');
        expect(viewExpression('"ciao luca"').eval(ctx)).toBe('ciao luca');
    });


    it('member viewExpression', () => {
        expect(viewExpression('foo').eval(ctx)).toBe('ciao');
        expect(viewExpression('foo.bla').eval(ctx)).toBe(undefined);
        expect(viewExpression('pippo.more.name').eval(ctx)).toBe('pluto');
    });

    it('logical viewExpression', () => {
        expect(viewExpression('xxx || foo').eval(ctx)).toBe('ciao');
    });

    it('unary operation', () => {
        expect(viewExpression('!foo').eval(ctx)).toBe(false);
        expect(viewExpression('!xxx').eval(ctx)).toBe(true);
    });

    it('test conditional viewExpression', () => {
        expect(viewExpression('foo ? foo : "bla"').eval(ctx)).toBe('ciao');
        expect(viewExpression('pippo.bla > 10000 ? pippo.bla-10000 : pippo.bla').eval(ctx)).toBe(2345);
    });

    it('Array viewExpression', () => {
        expect(viewExpression('["mars", "venus"]').eval(ctx)).toEqual(['mars', 'venus']);
        expect(viewExpression('[foo, missing]').eval(ctx)).toEqual(['ciao', undefined]);
        expect(viewExpression('[pippo.more.name, nested.foo()]').eval(ctx)).toEqual(['pluto', 'OK']);
    });

    it('call viewExpression', () => {
        expect(viewExpression('random()').eval(ctx)).toBeGreaterThan(0);
        expect(viewExpression('self()').eval(ctx)).toBe(ctx);
        expect(viewExpression('nested.bla()').eval(ctx)).toBe(ctx.nested);
        expect(viewExpression('nested.bla().foo()').eval(ctx)).toBe('OK');
        expect(viewExpression('nested.bla().set(0, "sun")').eval(ctx)).toBe('SET');
        expect(ctx.nested.v1).toBe(0);
        expect(ctx.nested.v2).toBe("sun");

        expect(viewExpression('nested.bla().set(random(), nested.foo())').eval(ctx)).toBe('SET');
        expect(ctx.nested.v1).toBeGreaterThan(0);
        expect(ctx.nested.v2).toBe("OK");
    });

    it('eval exceptions', () => {
        expect(() => viewExpression('nested.fdsg()').eval(ctx)).toThrow();
        expect(() => viewExpression('gddgd.bla()').eval(ctx)).toThrow();
        //
        logger.pop();
        expect(viewExpression('gddgd.bla()').safeEval(ctx)).toBe(undefined);
        expect(logger.pop().length).toBe(1);
        //
        expect(function () {
            try {
                viewExpression('"unclosed foo');
            } catch (e) {
                return e.message;
            }
        }()).toBe('Unclosed quote after "unclosed foo" at character 13');
    });

    it('identifiers', () => {
        expect(viewExpression('"ciao"').identifiers()).toEqual([]);
        expect(viewExpression('foo').identifiers()).toEqual(['foo']);
        expect(viewExpression('random()').identifiers()).toEqual([]);
        expect(viewExpression('pippo.bla').identifiers()).toEqual(['pippo']);
        expect(viewExpression('pippo.more.name').identifiers()).toEqual(['pippo']);
        expect(viewExpression('[pippo.bla]').identifiers()).toEqual(['pippo']);
        expect(viewExpression('[pippo.bla, foo]').identifiers()).toEqual(['pippo', 'foo']);
    });

    it('binary precedence', () => {
        expect(viewExpression('a+2*b').eval({a: 1, b: 3})).toBe(7);
        expect(function () {
            try {
                viewExpression('a + 2*');
            } catch (e) {
                return e.message;
            }
        }()).toBe('Expected expression after * at character 6');
    });

    it('numeric literals', () => {
        expect(viewExpression('a + 2.1*b').eval({a: 1, b: 3})).toBeCloseTo(7.3);
        expect(viewExpression('.5e3 + a').eval({a: 1})).toBeCloseTo(501);
    });
});
