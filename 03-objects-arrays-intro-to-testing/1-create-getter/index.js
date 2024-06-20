/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const pathKeys = path.split('.');
    return obj => {
        let res = obj;
        for (const key of pathKeys) {
            if (!Object.hasOwn(res, key)) {
                return;
            }
            res = res[key];
        }
        return res;
    }
}

function createGetterRec(path) {
    const pathParts = path.split('.');
    function rec(obj, partIdx) {
        const key = pathParts[partIdx];
        if (!Object.hasOwn(obj, key)) {
            return;
        }
        if (partIdx === pathParts.length - 1) {
            return obj[key]
        }
        return rec(obj[key], ++partIdx)
    }
    return obj => rec(obj, 0);
}
