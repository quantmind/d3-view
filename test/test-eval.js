import './utils';
import {viewExpression} from '../src/parser';


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

    it('identifiers', () => {
        expect(viewExpression('"ciao"').identifiers()).toEqual([]);
        expect(viewExpression('foo').identifiers()).toEqual(['foo']);
        expect(viewExpression('random()').identifiers()).toEqual([]);
        expect(viewExpression('pippo.bla').identifiers()).toEqual(['pippo']);
        expect(viewExpression('pippo.more.name').identifiers()).toEqual(['pippo']);
        expect(viewExpression('[pippo.bla]').identifiers()).toEqual(['pippo']);
        expect(viewExpression('[pippo.bla, foo]').identifiers()).toEqual(['pippo', 'foo']);
    });
});
