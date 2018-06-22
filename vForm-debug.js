///NOTE:不要在生产环境中使用本模块
(function () {
    if (!VForm) {
        console.warn("vForm 尚未定义");
        return;
    }
    Object.getPrototypeOf(VForm).Version = function(x){
        var vf =new this();
        console.log(vf.status.name+" v"+vf.status.version.join("."),"","");
    }
    


})();