export function getQueryVariable (variable, search = location.search) {
    if (!search) {
        return undefined
    }
    var query = search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
    }
    return undefined
}

export function isApp(){
    if (sessionStorage.getItem('isAPP')) {
        return true
    } else if (getQueryVariable('isAPP')) {
        return true
    } else if (window.JsHook && window.JsHook.goToOrder) {
        return true
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.goToOrder) {
        return true
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getQuoteIndexMore) {
        return true 
    } else {
        return false
    }
}

export function appQuoteIndexMore (peid, pid, gtsId) {
    if (window.JsHook && JsHook.getQuoteIndexMore) {
        JsHook.getQuoteIndexMore(peid, pid, gtsId)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getQuoteIndexMore) {
        window.webkit.messageHandlers.getQuoteIndexMore.postMessage({ peid: peid, pid:pid, gtsId: gtsId })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appGetQuoteCode (uicode) {
    if (window.JsHook && JsHook.getQuoteCode) {
        JsHook.getQuoteCode(uicode)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getQuoteCode) {
        window.webkit.messageHandlers.getQuoteCode.postMessage({ uicode: uicode })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appGoToOrder (direction, uicode) {
    if (window.JsHook && JsHook.goToOrder) {
        JsHook.goToOrder(direction, uicode)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.goToOrder) {
        window.webkit.messageHandlers.goToOrder.postMessage({ direction: direction , uicode: uicode })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appIframeHeight (height) {
    if (window.JsHook && JsHook.getIframeHeight) {
        JsHook.getIframeHeight(height)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getIframeHeight) {
        window.webkit.messageHandlers.getIframeHeight.postMessage({ height: height })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appRegisterResult (registerResult) {
    if (window.JsHook && JsHook.getRegisterResult) {
        JsHook.getRegisterResult(registerResult)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getRegisterResult) {
        window.webkit.messageHandlers.getRegisterResult.postMessage({ registerResult: registerResult })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appRegisterStatus (registerStatus) {
    if (window.JsHook && JsHook.appOnRegisterSuc) {
        JsHook.appOnRegisterSuc(registerStatus.openacc)
    } else 
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOnRegisterSuc) {
        window.webkit.messageHandlers.appOnRegisterSuc.postMessage({ registerStatus: registerStatus })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appAccountLogin (loginInfo) {
    if (window.JsHook && JsHook.appAccountLogin) {
        JsHook.appAccountLogin(loginInfo.customerNumber, loginInfo.password, loginInfo.href, loginInfo.other_href)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getRegisterResult) {
        window.webkit.messageHandlers.getRegisterResult.postMessage({ registerResult: loginInfo })
    } else {
        // NOT APP, see if we need other handling here
    }
}

export function appPasswordResult (passwordResult) {
    if (window.JsHook && JsHook.getPasswordResult) {
        JsHook.getPasswordResult(passwordResult)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getPasswordResult) {
        window.webkit.messageHandlers.getPasswordResult.postMessage({ passwordResult: passwordResult })
    } else {
        // NOT APP, see if we need other handling here
    }
}

// app 退回上一层
export function appGoBack () {
    if (window.JsHook && JsHook.appGoBack) {
        JsHook.appGoBack()
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoBack) {
        window.webkit.messageHandlers.appGoBack.postMessage({ url: '123' })
    } else {
        window.close()
    }
}

// 关闭app窗口
export function appClose () {
    if (window.JsHook && JsHook.appClose) {
        JsHook.appClose()
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appClose) {
        window.webkit.messageHandlers.appClose.postMessage({ url: '123' })
    } else {
        window.close()
    }
}

// 判断app方法是否存在
export function appFunctionisExist (funcName) {
    return (window.JsHook && JsHook[funcName]) || (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[funcName])
}

// app旋转
export function appSetDeviceRotate () {
    console.warn('appSetDeviceRotate: ', Date.now())
    appFunction('appSetDeviceRotate')
}