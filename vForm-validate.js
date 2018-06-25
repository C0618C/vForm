(function () {
    if (!VForm) {
        console.warn("vForm 尚未定义");
        return;
    }

    Object.getPrototypeOf(VForm).Validate = function (x) {
        console.log(this, x);
    }
    Object.getPrototypeOf(VForm.Validate).Format = function (errInfo) {
        var reg = /\$\{[^{}]*?\}/;
        var msg = errInfo.errinfo;
        return msg.replace(/\$\{([^{}]*?)\}/g, function (match, key) { return errInfo[key] });
    }

    //TODO: 自动根据widget类型，加入基础校验

    //必填·通用
    Object.getPrototypeOf(VForm.Validate).require = function (widget, options) {
        if (options === false) return true;

        var d = widget.GetData();
        if (typeof (d) === "object" && d.value !== undefined && d.value !== "") return true;
        else if (typeof (d) === "string" && d !== "") return true;

        return "【${name}】不允许为空";
    }

    //只能为数字 input:type=number
    Object.getPrototypeOf(VForm.Validate).isnum = function (widget, options) {
        if (options === false) return true;
        return IsNum(widget.GetValue()) ? true : "【${name}】要求填写数字。";
    }

    //最小值
    Object.getPrototypeOf(VForm.Validate).min = function (widget, options) {
        if (options === false || !IsNum(options)) return true;

        var d = widget.GetValue();
        if(IsNum(d)){
            d*=1;
            options*=1;
            return Math.min(d,options) === options?true:"【${name}】不能小于：${options}。";//FIXME:返回结果应当有options项用于生产错误提示
        }

        return "【${name}】要求填写数字。";
    }
    //最大值
    Object.getPrototypeOf(VForm.Validate).max = function (widget, options) {
        if (options === false || !IsNum(options)) return true;

        var d = widget.GetValue();
        if(IsNum(d)){
            d*=1;
            options*=1;
            return Math.max(d,options) === options?true:"【${name}】不能大于：${options}。";//FIXME:返回结果应当有options项用于生产错误提示
        }

        return "【${name}】要求填写数字。";
    }

    //介于[a,b]之间
    Object.getPrototypeOf(VForm.Validate).rang = function (widget, options) {
        if (options === false || !Array.isArray(options)) return true;

        var d = widget.GetValue();
        if(IsNum(d)){
            d*=1;
            var min = Math.min(options[0]*1,options[1]*1);
            var max = Math.max(options[0]*1,options[1]*1);
            return (d>=min && d<=max)?true:"【${name}】只能介于："+min+"~"+max+"。";
        }

        return "【${name}】要求填写数字。";
    }

    //整数
    Object.getPrototypeOf(VForm.Validate).int = function (widget, options) {
        if (options === false) return true;

        var d = widget.GetValue();
        if(IsNum(d)){
            d*=1;
            options*=1;
            return Math.floor(d) === options?true:"【${name}】只能是整数。";
        }

        return "【${name}】要求填写数字。";
    }

    function IsNum(n) {
        if (typeof (n) === "number") return true;
        if (typeof (n) !== "boolean" && n != null && n != "") return !isNaN(n);
        return false;
    }
})();