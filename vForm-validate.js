(function () {
    if (!VForm) {
        console.warn("vForm 尚未定义");
        return;
    }
    Object.getPrototypeOf(VForm).Validate = function(x){
        console.log(this);
    }
    
})();