(function () {
    if (!VForm) {
        console.warn("【en语言包】：vForm 尚未定义");
        return;
    }

    if(VForm.I18N===undefined){
        Object.getPrototypeOf(VForm).I18N = function(){}
    }
    Object.getPrototypeOf(VForm.I18N).en = {
        "数字":"number"
        ,"邮件":"e-mail"
        ,"地址":"address"
        ,"搜索":"search"
        ,"是":"Yes","否":"No"
    }
})();