import WebpackDependencyInjector from './';

describe('WebpackDependencyInjector', () => {
    it('when init new instance with options --> then return object with options', () => {
        // Given
        const options = { regex: true };

        // When
        const plugin = new WebpackDependencyInjector(options);

        // Then
        expect(plugin).toEqual({ options });
    })
});
