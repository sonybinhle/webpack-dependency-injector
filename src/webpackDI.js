const path = require('path');
const webpack = require('webpack');

function normalizeContext(context) {
    const info = path.parse(context);

    return info.ext ? info.dir : context;
}

class WebpackDI {
    constructor(options) {
        this.injectSource = options.source;
        this.injectMap = options.map;
        this.excludes = [/node_modules/].concat(options.excludes || []);

        this.replaceHandler = this.replaceHandler.bind(this);
        this.sassImporter = this.sassImporter.bind(this);

        this.plugin = new webpack.NormalModuleReplacementPlugin(/.*/, this.replaceHandler);
    }

    apply(compiler) {
        this.plugin.apply(compiler);
    }

    replaceHandler(resource) {
        const injectedPath = this.getInjectedPath(resource.request, resource.context);

        if (injectedPath) resource.request = injectedPath; // eslint-disable-line no-param-reassign
    }

    isMatched(url) {
        return !this.excludes.some(regex => regex.test(url));
    }

    getInjectedPath(url, context) {
        const fullPath = path.resolve(normalizeContext(context), url);

        if (this.isMatched(url) && this.isMatched(context)) {
            const matchedKey = Object.keys(this.injectMap).find(key => new RegExp(key).test(fullPath));

            if (matchedKey) {
                const newPath = path.resolve(this.injectSource, this.injectMap[matchedKey]);

                if (newPath) {
                    return newPath;
                }

                throw new Error(`WebpackDI: new path is not found! ${newPath}`);
            }
        }

        return null;
    }

    sassImporter(url, prev) {
        const replacedPath = this.getInjectedPath(url, prev);

        return replacedPath ? { file: replacedPath } : null;
    }
}

module.exports = WebpackDI;
