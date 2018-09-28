import './utils';
import {viewExpression, jsep, viewProviders} from '../index';


var logger = viewProviders.logger;


describe('viewExpression -', function() {

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

    it('conditional viewExpression', () => {
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

    it('parser exception', () => {
        expect(() => viewExpression('1.2.3')).toThrow(
            new Error('Unexpected period at character 3'));
        expect(() => viewExpression('1ab')).toThrow(
            new Error('Variable names cannot start with a number (1a) at character 1'));
        expect(() => viewExpression('1e')).toThrow(
            new Error('Expected exponent (1e) at character 2'));
        expect(() => viewExpression('(a+b')).toThrow(
            new Error('Unclosed ( at character 4'));
        expect(() => viewExpression('.a')).toThrow(
            new Error('Variable names cannot start with a number (.a) at character 1'));
        expect(() => viewExpression('a=4')).toThrow(
            new Error('Unexpected "=" at character 1'));
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
        expect(viewExpression('"ciao"').identifiers()).toEqual(new Set);
        expect(viewExpression('foo').identifiers()).toEqual(new Set(['foo']));
        expect(viewExpression('random()').identifiers()).toEqual(new Set(['random']));
        expect(viewExpression('pippo.bla').identifiers()).toEqual(new Set(['pippo.bla']));
        expect(viewExpression('pippo.more.name').identifiers()).toEqual(new Set(['pippo.more.name']));
        expect(viewExpression('[pippo.bla]').identifiers()).toEqual(new Set(['pippo.bla']));
        expect(viewExpression('[pippo.bla, foo]').identifiers()).toEqual(new Set(['pippo.bla', 'foo']));
        expect(viewExpression('[pippo.bla.test(), foo.go(bla)]').identifiers()).toEqual(
            new Set(['pippo.bla.test', 'foo.go', 'bla']));
        expect(viewExpression('item.label || item.name').identifiers()).toEqual(
            new Set(['item.label', 'item.name']));
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
        expect(viewExpression('(a + b)*c').eval({a: 1, b: 3, c: 2})).toBe(8);
    });

    it('array number', () => {
        expect(viewExpression('d[0]').eval({d: [0, 3, 4]})).toEqual(0);
        expect(viewExpression('d[1]').eval({d: [0, 3, 4]})).toEqual(3);
        expect(viewExpression('d[2]').eval({d: [0, 3, 4.5]})).toEqual(4.5);
        expect(viewExpression('2*d[2]').eval({d: [0, 3, 4.5]})).toEqual(9);
        expect(viewExpression('d.length').eval({d: [0, 3, 4.5]})).toEqual(3);
        expect(viewExpression('d.shift()').eval({d: [0, 3, 4.5]})).toEqual(0);
        expect(viewExpression('d.slice(0, 2)').eval({d: [0, 3, 4.5]})).toEqual([0, 3]);
    });

    it('array bug', () => {
        var d = [0, 3, 4];
        d.key = 'test';
        expect(viewExpression('d.key + ": " + d[1]').eval({d: d})).toEqual('test: 3');
    });

    it('special identifiers', () => {
        expect(viewExpression('false').eval({})).toEqual(false);
        expect(viewExpression('true').eval({})).toEqual(true);
        expect(viewExpression('null').eval({})).toEqual(null);
    });

    it('add/remove literals', () => {
        jsep.addLiteral('vero', true);
        expect(viewExpression('vero').eval({vero: 'fooo'})).toEqual(true);
        jsep.removeLiteral('vero');
        expect(viewExpression('vero').eval({vero: 'fooo'})).toEqual('fooo');
    });

    it('identifiers issue #21', () => {
        var expr = viewExpression('$active(tab.show, rootShow)'),
            identifiers = expr.identifiers();
        expect(identifiers.size).toBe(3);
    });

    it ('add binary op', () => {
        jsep.addBinaryOp('**', 3);
        expect(viewExpression('a**p').eval({a: 2, p: 10})).toEqual(1024);
        jsep.removeBinaryOp('**');
        expect(() => viewExpression('a**p')).toThrow(
            new Error('Expected expression after * at character 2'));
    });

    it ('add unary op', () => {
        jsep.addUnaryOp('>>');
        let ex = viewExpression('>>2');
        expect(ex.parsed.type).toBe('UnaryExpression');
        expect(ex.parsed.operator).toBe('>>');
        jsep.removeUnaryOp('>>');
        ex = viewExpression('>>2');
        expect(ex.parsed.type).toBe('BinaryExpression');
    });

});
