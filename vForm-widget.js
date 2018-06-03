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
    var _vfwm_GetWidget = function (setting) {
        var type = setting.type;
        var s = widget[type];
        if (s === undefined) {
            console.warn("获取Widget失败，不存在的Widget定义：" + type);
            return false;
        }

        var w = new s(setting);
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
        this.cell = null;
        this.label = null;
        this.baseSetting = setting;
        this.curSetting = setting;
        this.ctrlId = null;

        //一般不需要重载的API
        this.GetData = _v_widget_GetData;
        this.GetText = _v_widget_GetText;
        this.GetValue = _v_widget_GetValue;
        this.SetData = _v_widget_SetData;
        this.SetText = _v_widget_SetText;
        this.SetValue = _v_widget_SetValue;
        this.IsCtrl = _v_widget_IsCtrl;

        //需要重载的API
        this.Create = null;
        this.SetOption = null;
        this.Check = null;
        this.Refresh = null;

        _v_widget_Init.call(this);
        return this;
    }

    //控件初始化
    function _v_widget_Init() {
        this.dom = document.createElement("div");
        this.cell = document.createElement("div");
        var n = document.createElement("div");
        this.label = document.createElement("label");
        this.class = "vform_widget";
        this.label.class = "vform_widget_label";
        this.label.innerText = this.curSetting.name;
        this.cell.class = "vform_widget_cell";

        n.appendChild(this.label);
        this.dom.appendChild(n);
        this.dom.appendChild(this.cell);
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
    function _v_widget_IsCtrl(){
        //TODO:处理node_code的可控制权限
        return !(this.curSetting.readonly === false);// && this.curSetting.node_code
    }

    //定义控件
    VFWidgetFactory.AddWidget("text,number", function (setting) {
        //继承父类
        vfWidget.call(this, setting);

        //重载子类方法
        this.Create = function () {
            var obj = null;
            var s = this.curSetting;

            if (this.IsCtrl()) {
                obj = document.createElement("input");
                obj.type = s.type;
            } else {
                obj = document.createElement("span");
            }
            obj.id = MakeAnId(8) + "_" + s.id;
            this.ctrlId = obj.id;
            if (s.cls) this.cell.class = this.cell.class + " " + s.cls;
            if (s.select_name) obj.name = s.select_name;
            if (s.value !== undefined) this.SetValue(s.value);

            this.cell.appendChild(obj);
        };

        this.Refresh = function(){
            if(this.IsCtrl()){
                this.cell.value = this.GetValue();
            }else{
                document.getElementById(this.ctrlId).innerText=this.GetText();
            }
        }

        return this;
    });
})();