(function () {
    var _vf_WidgetFactory = {
        widget: []

        , AddWidget: _vfwm_AddWidget
        , GetWidget: _vfwm_GetWidget
    }
    var _vfwm_AddWidget = function (type, setting) {
        var types = type.join(",");
        for (var i = 0; i < types.length; i++) {
            (function (i) {
                if (this.widget[types[i]] !== undefined) {
                    console.warn("注册Widget出错，已存在的Widget定义：" + types[i]);
                    return false;
                }
                this.widget[types[i]] = setting;
            })(i);
        }
    }
    //根据配置 生成控件
    var _vfwm_GetWidget = function (type,setting) {
        if (this.widget[type] === undefined) {
            console.warn("获取Widget失败，不存在的Widget定义：" + type);
            return false;
        }
        
        return this.widget[type];
    }








    function vfWidget(setting) {
        /*  */
        this.Create = _v_widget_Create;

        this.GetData = null;
        this.GetText = null;
        this.GetValue = null;

        this.SetData = null;
        this.SetData = null;
        this.SetValue = null;

        this.Check = null;
        return this;
    }

    //默认创建函数
    function _v_widget_Create() {
        console.log("创建函数执行。")
    }

    var _inherit = function (baseclass, childclass, param) {
        var base = new baseclass(param);
        //this = base;
        for (var a in baseclass) {
            childclass[a] = baseclass[a];
        }
        baseclass = null;
    }






    window.VFWidgetFactory = _vf_WidgetFactory;
})();