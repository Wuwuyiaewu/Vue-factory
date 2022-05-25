/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 * PS timeoutCache is for setting up unique timers for different validation functions
 */
 export function debounce (func, wait = 200, immediate = false) {
    const timeoutCache = {};
    return function (...rest) {
        if (timeoutCache[rest[0].name]) clearTimeout(timeoutCache[rest[0].name])
        if (immediate) {
            const callNow = !timeoutCache[rest[0].name]
            timeoutCache[rest[0].name] = setTimeout(() => {
                timeoutCache[rest[0].name] = null
            }, wait)
            if (callNow) func.apply(this, rest)
        } else {
            timeoutCache[rest[0].name] = setTimeout(() => {
                func.apply(this, rest)
            }, wait)
        }
    }
}

/**
 * @desc 函数防抖(用于异步Promise)
 * @param func 函数
 * @param wait 延迟执行毫秒数
 */
export function debouncePromise (func, wait = 200) {
    let timer
    return function (...rest) {
        return new Promise((resolve, reject) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                resolve(func.apply(this, rest))
            }, wait)
        })
    }
}