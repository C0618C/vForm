(function () {
    if (!VForm) {
        console.warn("【多语言模块】：vForm 尚未定义");
        return;
    }

    Object.getPrototypeOf(VForm).Lang = function (x) {
        console.log(this, x);
    }
});