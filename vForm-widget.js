(function () {
    var widget = [];
    function VFWidgetFactory() {
        this.AddWidget = _vfwm_AddWidget;
        this.GetWidget = _vfwm_GetWidget;

        return this;
    }
    var _vfwm_AddWidget = function (type, setting) {
        var types = type.split(",");
        for (var i = 0; i < types.length; i++) {
            (function (i) {
                if (widget[types[i]] !== undefined) {
                    console.warn("注册Widget出错，已存在的Widget定义：" + types[i]);
                    return false;
                }
                widget[types[i]] = setting;
            })(i);
        }
    }
    //根据配置 生成控件
    var _vfwm_GetWidget = function (type, setting) {
        var s = widget[type];
        if (s === undefined) {
            console.warn("获取Widget失败，不存在的Widget定义：" + type);
            return false;
        }

        var w = new s(setting);
        var dom = 

        return w;
    }
    var vf = new VFWidgetFactory();
    window.VFWidgetFactory = vf;
})();



(function () {
    function vfWidget(setting) {
        this.data = {
            value: ""
            , text: ""
        };
        this.dom = null;
        this.baseSetting = setting;
        this.curSetting = setting;

        //一般不需要重载的API
        this.GetData = _v_widget_GetData;
        this.GetText = _v_widget_GetText;
        this.GetValue = _v_widget_GetValue;
        this.SetData = _v_widget_SetData;
        this.SetText = _v_widget_SetText;
        this.SetValue = _v_widget_SetValue;

        //需要重载的方法
        this.Create = _v_widget_Create;        
        this.SetOption = _v_widget_SetOption;
        this.Check = _v_widget_Check;
        this.Refresh = _v_widget_Refresh;
        return this;
    }

    function _v_widget_GetData() {
        return this.data;
    }
    function _v_widget_GetText() {
        return this.data.text;
    }
    function _v_widget_GetValue() {
        return this.data.value;
    }
    function _v_widget_SetData(data) {
        this.data.text = data.text;
        this.data.value = data.value;
    }
    function _v_widget_SetText(text) {
        this.data.text = text;
    }
    function _v_widget_SetValue(value) {
        this.data.value = value;
    }

    //需要重载的函数
    function _v_widget_Create() {
        console.log("创建函数执行。");
    }

    function _v_widget_SetOption() { }
    function _v_widget_Check() { }


    var _inherit = function (baseclass, childclass, param) {
        var base = new baseclass(param);
        //this = base;
        for (var a in baseclass) {
            childclass[a] = baseclass[a];
        }
        baseclass = null;
    }

    //定义控件
    VFWidgetFactory.AddWidget("text,number", function(setting) {
        //继承父类
        vfWidget.call(this, setting);

        //重载子类方法
        this.Create = function () {
            this.dom = document.createElement("div");
            dom.class=" "+this.curSetting.cls;

            
        };
    });
})();