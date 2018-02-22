const WebpackDI = require('./webpackDI');

describe('webpackDI', function () {
    it('when create new instance -> options is set', function () {
        // Given
        const options = {
            source: '/src',
            map: {
                x: 'y',
            },
            excludes: [/version/],
        };

        // When
        const webpackDi = new WebpackDI(options);

        // Then
        expect(webpackDi.injectSource).toEqual(options.source);
        expect(webpackDi.injectMap).toEqual(options.map);
        expect(webpackDi.excludes).toEqual([/node_modules/].concat(options.excludes));
    });
});