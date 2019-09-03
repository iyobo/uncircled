import {BadParentClass, GoodParentClass} from './util/TestClasses';

describe('Normal Root Node', () => {
    it('when serializing, throws Circular structure error if not inheriting ParentClassNode', () => {
        try {
            const parent = new BadParentClass();
            const serializedClass = JSON.stringify(parent);

            fail('The last line should have thrown an error');
        } catch (err) {
            // This will either be a circular reference error or a maximum call stack error
        }
    });
});

describe('ParentClassNode', () => {
    it('serializes with leafNodes', () => {
        const parent = new GoodParentClass();
        const serializedClass = JSON.stringify(parent);

        expect(serializedClass).toBe('{"foo":"bar","childStore":"{\\"ab\\":\\"wonton\\",\\"cd\\":\\"faro\\"}"}');
    });
});
