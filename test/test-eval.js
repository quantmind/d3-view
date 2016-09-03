import view from './utils';

var expression = view.expression;

describe('expression.eval', function() {

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

        expect(expression('"ciao"').eval(ctx)).toBe('ciao');
    });


    it('member expression', () => {
        expect(expression('foo').eval(ctx)).toBe('ciao');
        expect(expression('foo.bla').eval(ctx)).toBe(undefined);
        expect(expression('pippo.more.name').eval(ctx)).toBe('pluto');
    });

    it('logical expression', () => {
        expect(expression('xxx || foo').eval(ctx)).toBe('ciao');
    });

    it('test conditional expression', () => {
        expect(expression('foo ? foo : "bla"').eval(ctx)).toBe('ciao');
        expect(expression('pippo.bla > 10000 ? pippo.bla-10000 : pippo.bla').eval(ctx)).toBe(2345);
    });

    it('Array expression', () => {
        expect(expression('["mars", "venus"]').eval(ctx)).toEqual(['mars', 'venus']);
        expect(expression('[foo, missing]').eval(ctx)).toEqual(['ciao', undefined]);
        expect(expression('[pippo.more.name, nested.foo()]').eval(ctx)).toEqual(['pluto', 'OK']);
    });

    it('call expression', () => {
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

    it('identifiers', () => {
        expect(expression('"ciao"').identifiers()).toEqual([]);
        expect(expression('foo').identifiers()).toEqual(['foo']);
        expect(expression('random()').identifiers()).toEqual([]);
        expect(expression('pippo.bla').identifiers()).toEqual(['pippo']);
        expect(expression('pippo.more.name').identifiers()).toEqual(['pippo']);
        expect(expression('[pippo.bla]').identifiers()).toEqual(['pippo']);
        expect(expression('[pippo.bla, foo]').identifiers()).toEqual(['pippo', 'foo']);
    });
});
