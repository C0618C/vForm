(function () {
    if (!VForm) {
        console.warn("【多语言模块】：vForm 尚未定义");
        return;
    }

    /**
     * 初始化语言包，负责相关语言文件的引入
     */
    Object.getPrototypeOf(VForm).InitLang = function (language) {
        //TODO:判断是否初次设置语言，如果是，引入新语言包
        return true;

        console.log(this, x);
        return false;
    }
})();