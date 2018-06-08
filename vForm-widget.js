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
        this.dom = null;                        //整个文档对象，包含标签和对应的控件
        this.cell = null;                       //控件文档对象
        this.label = null;                      //标签文档对象
        this.baseSetting = setting;             //默认设置
        this.curSetting = setting;              //当前设置、实际设置、最新设置
        this.ctrlId = null;                     //控件的ID
        this.ctrlObj = null; //可以用于聚焦的控件

        //一般不需要重载的API
        this.GetData = _v_widget_GetData;
        this.GetText = _v_widget_GetText;
        this.GetValue = _v_widget_GetValue;
        this.SetData = _v_widget_SetData;
        this.SetText = _v_widget_SetText;
        this.SetValue = _v_widget_SetValue;
        this.IsCtrl = _v_widget_IsCtrl;
        this.Focus = _v_widget_Focus;
        this.ToString = _v_widget_ToString;
        this.Create = _v_widget_Create;
        this.GetOption = _v_widget_GetOption;

        //需要重载的API
        this.Refresh = null;           //用于将值同步到控件上
        this._createDomObj = null;      //创建实际的控件
        this.SetOption = null;
        this.Check = null;

        _v_widget_Init.call(this);
        return this;
    }

    //控件初始化
    function _v_widget_Init() {
        this.dom = document.createElement("div");
        this.dom.className = "vform_widget";
        if (this.curSetting.name === undefined) {
            this.cell = this.dom;
        } else {
            var n = document.createElement("div");
            this.cell = document.createElement("div");
            this.label = document.createElement("label");
            this.label.className = "vform_widget_label";
            this.label.innerText = this.curSetting.name;
            n.appendChild(this.label);
            this.dom.appendChild(n);
            this.dom.appendChild(this.cell);
        }
        this.cell.className = "vform_widget_cell";

    }
    function _v_widget_Create() {
        var obj = null;
        var s = this.curSetting;

        if (this.IsCtrl()) {
            obj = this._createDomObj();
            if (this.ctrlObj === null) this.ctrlObj = obj;
        } else {
            obj = document.createElement("span");
        }
        if (obj) {
            obj.id = MakeAnId(8) + "_" + s.id;
            this.ctrlId = obj.id;
            if (this.label) this.label.setAttribute("for", this.ctrlId);
            if (s.cls) this.cell.class = this.cell.class + " " + s.cls;
            if (s.select_name) obj.name = s.select_name;
            if (s.value !== undefined) this.SetValue(s.value);

            //DEBUG:
            this.dom.setAttribute("role", "dom");
            this.cell.setAttribute("role", "cell");
            if(this.label) this.label.setAttribute("role", "label");
            this.ctrlObj.setAttribute("role", "ctrlObj");

            this.cell.appendChild(obj);
        }
        if (s.value !== undefined) this.SetValue(s.value, true);
    }

    function _v_widget_GetData() {
        return this.data;
    }
    function _v_widget_GetText() {
        return this.data.text;
    }
    function _v_widget_GetValue(isString) {
        return isString === true ? this.ToString() : this.data.value;
    }
    function _v_widget_ToString(isString) {
        return JSON.stringify(this.data.value);
    }
    function _v_widget_SetData(data, isRefresh) {
        this.data.text = data.text;
        this.data.value = data.value;
        if (isRefresh !== false) this.Refresh("data");
    }
    function _v_widget_SetText(text, isRefresh) {
        this.data.text = text;
        if (isRefresh !== false) this.Refresh("text");
    }
    function _v_widget_SetValue(value, isRefresh) {
        this.data.value = value;
        if (isRefresh !== false) this.Refresh("value");
    }
    function _v_widget_IsCtrl() {
        //TODO:处理node_code的可控制权限
        return !(this.curSetting.readonly === false);// && this.curSetting.node_code
    }
    function _v_widget_Focus() {
        return this.ctrlObj ? this.ctrlObj.focus() : false;
    }

    function _v_widget_GetOption() {
        return this.curSetting;
    }


    //定义控件    
    VFWidgetFactory.AddWidget("text,number,password,button", function (setting) {
        //继承父类
        vfWidget.call(this, setting);

        //重载子类方法
        this._createDomObj = function () {
            var obj = document.createElement("input");
            obj.type = setting.type;
            if (setting.placeholder) obj.setAttribute("placeholder", setting.placeholder);
            var wg = this;
            obj.addEventListener("change", function () {
                wg.SetData({ text: obj.value, value: obj.value }, false);
            });
            return obj;
        }

        this.Refresh = function (type) {
            if (this.IsCtrl()) {
                this.ctrlObj.value = this.GetValue();
            } else {
                //document.getElementById(this.ctrlId).innerText = this.GetText();
            }
        }

        this.Create();
        return this;
    });
    VFWidgetFactory.AddWidget("textarea", function (setting) {
        //继承父类
        vfWidget.call(this, setting);

        //重载子类方法
        this._createDomObj = function () {
            var obj = document.createElement("textarea");
            var wg = this;
            obj.addEventListener("change", function () {
                wg.SetData({ text: obj.value, value: obj.value }, false);
            });
            return obj;
        }

        this.Create();
        return this;
    });
    VFWidgetFactory.AddWidget("checkbox,radio", function (setting) {
        //继承父类
        vfWidget.call(this, setting);
        var s = setting;

        //根据options里的选项，进行初始化
        this._CreateByOptions = function () {
            var ss = this.curSetting;
            var n = s.select_name || MakeAnId(10);
            if (!ss.options || ss.options.length == 0) return;

            for (var i = 0; i < ss.options.length; i++) {
                var o = document.createElement("input");
                var id = MakeAnId(8);
                o.type = s.type;
                o.name = n;
                o.value = ss.options[i].value;
                o.id = id;

                var l = document.createElement("label");
                l.innerText = ss.options[i].text;
                l.setAttribute("for", id);

                this.cell.appendChild(o);
                this.cell.appendChild(l);
            }
        }

        //重载子类方法
        this._createDomObj = function () {
            if (!s.options || s.options.length == 0)
                this._LoadFromOptions();

            this._CreateByOptions();
            return null;
        }

        this._LoadFromOptions = function () {
            console.warn("需要加载数据源");
        }

        this.Create();
        return this;
    });
    VFWidgetFactory.AddWidget("table", function (setting) {
        //继承父类
        vfWidget.call(this, setting);

        this.widgets = [];
        //重载子类方法
        this._createDomObj = function () {
            var s = setting;
            var obj = document.createElement(s.type);
            var wg = this;
            var th = document.createElement("tr");
            var tr = document.createElement("tr");
            for (var c = 0; c < s.widgets.length; c++) {
                var hc = document.createElement("th");
                hc.innerText = s.widgets[c].name;
                th.appendChild(hc);

                var bc = document.createElement("td");
                var w = VFWidgetFactory.GetWidget(s.widgets[c]);
                this.widgets.push(w);
                bc.appendChild(w.cell);
                tr.appendChild(bc);
            }
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");

            thead.appendChild(th);
            tbody.appendChild(tr)
            obj.appendChild(thead);
            obj.appendChild(tbody);

            if (s.DataTable === true) {
                obj.setAttribute("class", "table table-striped table-bordered");
                $(obj).DataTable();
            }
            return obj;
        }

        this.Create();
        return this;
    });
})();