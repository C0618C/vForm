(function () {
    if (!VForm) {
        console.warn("vForm 尚未定义");
        return;
    }
    Object.getPrototypeOf(VForm).Validate = function(x){
        console.log(this,x);
    }
    Object.getPrototypeOf(VForm.Validate).Format = function(errInfo){
        var reg = /\$\{[^{}]*?\}/;
        var msg = errInfo.errinfo;
        return msg.replace(/\$\{([^{}]*?)\}/g,function(match,key){return errInfo[key]});
    }

    //TODO: 自动根据widget类型，加入基础校验
    
    Object.getPrototypeOf(VForm.Validate).require = function(widget,options){
        if(options === false) return true;

        var d = widget.GetData();
        console.log(d);
        if(typeof(d) === "object" && d.value!==undefined && d.value !=="") return true;
        else if(typeof(d) === "string" && d!=="")return true;

        return "【${name}】不允许为空";
    }


})();