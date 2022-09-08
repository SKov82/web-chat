window.getValue = (obj, path, defaultValue) => {
    const keys = path.split('.')
    let result = obj

    for (let key of keys) {
        result = result[key]

        if (result === undefined) {
            return defaultValue
        }
    }

    return result ?? defaultValue
}

window.Templator = (function () {
    class Templator {
        TEMPLATE_REGEXP = /{{(.*?)}}/gi

        constructor(template) {
            this._template = template
        }

        compile(context) {
            return this._compileTemplate(this._template, context)
        }

        _compileTemplate(tmpl, context) {
            let key = null
            const regExp = this.TEMPLATE_REGEXP

            while (key = regExp.exec(tmpl)) {
                if (key[1]) {
                    const tmplValue = key[1].trim()
                    const data = window.getValue(context, tmplValue)

                    if (typeof data === "function") {
                        window[tmplValue] = data
                        tmpl = tmpl.replace(new RegExp(key[0], "gi"), `window.${key[1].trim()}()`)
                        continue
                    }

                    tmpl = tmpl.replace(new RegExp(key[0], "gi"), data)
                }
            }

            return tmpl
        }
    }

    return Templator
})()
