(function () {
    var widget = [];
    function VFWidgetFactory() {
        this.AddWidget = _vfwm_AddWidget;
        this.GetWidget = _vfwm_GetWidget;

        return this;
    }
    var _vfwm_AddWidget = function (type, setting_fn) {
        var types = type.split(",");
        for (var i = 0; i < types.length; i++) {
            (function (i) {
                if (widget[types[i]] !== undefined) {
                    console.warn("注册Widget出错，已存在的Widget定义：" + types[i]);
                    return false;
                }
                widget[types[i]] = setting_fn;
            })(i);
        }
    }
    //根据配置 生成控件
    var _vfwm_GetWidget = function (setting, vform) {
        var type = setting.type;
        var s = widget[type];
        if (s === undefined) {
            console.warn("获取Widget失败，不存在的Widget定义：" + type);
            return false;
        }

        var w = new s(setting, vform);
        return w;
    }
    var vf = new VFWidgetFactory();
    window.VFWidgetFactory = vf;
})();



(function () {
    var parent = null;
    function vfWidget(setting, vform) {
        this.data = {
            value: ""
            , text: ""
        };
        this.dom = null;                        //整个文档对象，包含标签和对应的控件
        this.cell = null;                       //控件文档对象
        this.label = null;                      //标签文档对象
        this.baseSetting = DeepClone(setting);             //默认设置
        this.curSetting = setting;              //当前设置、实际设置、最新设置
        this.ctrlId = null;                     //控件的ID
        this.ctrlObj = null;                    //可以用于聚焦的控件
        this.requireObj = null;                 //用于显示必填的提示
        this.hintObj = null;                      //用于提示错误的元素
        this.id = setting.id;


        //一般不需要重载的API
        this.GetData = _v_widget_GetData;
        this.GetText = _v_widget_GetText;
        this.GetValue = _v_widget_GetValue;
        // this.InitData = _v_widget_InitData;                     //初始化控件的值，不触发校验
        this.SetData = _v_widget_SetData;
        this.SetText = _v_widget_SetText;
        this.SetValue = _v_widget_SetValue;
        this.IsCtrl = _v_widget_IsCtrl;
        this.Focus = _v_widget_Focus;
        this.ToString = _v_widget_ToString;
        this.Create = _v_widget_Create;
        this.GetOption = _v_widget_GetOption;
        this.Check = _v_widget_Check;
        this.SetHint = _v_widget_SetHint;
        this.I18N = vform ? vform.I18N.bind(vform) : function (x) { return x; };         //多语种翻译工具

        //需要重载的API
        this.Refresh = _v_widget_Refresh;           //用于将值同步到控件上
        this._createDomObj = null;      //创建实际的控件
        this.SetOption = null;

        parent = vform;
        _v_widget_Init_bs.call(this, vform);
        return this;
    }

    function _v_widget_Init_bs(vform) {
        var vs = vform ? vform.GetOption() : {};

        this.dom = document.createElement("div");
        this.dom.className = "form_vf_row";// box col_xs_12 col_sm_" + a;
        if (this.curSetting.name === undefined) {
            this.cell = this.dom;
        } else {
            this.cell = document.createElement("div");
            this.label = document.createElement("label");
            var lbtext = document.createElement("span");
            this.requireObj = document.createElement("span");
            this.label.className = "col_form_label";// col_xs_2  col_sm_" + lw;
            this.requireObj.className = "text-danger";            //必填的样式
            this.cell.className = "vform_cell";// col_xs_10 col_sm_" + ow;
            lbtext.innerText = this.I18N(this.curSetting.name);

            if (this.curSetting.validate && this.curSetting.validate.require) this.requireObj.innerText = "*";

            this.label.appendChild(this.requireObj);
            this.label.appendChild(lbtext);
            this.dom.appendChild(this.label);
            this.dom.appendChild(this.cell);
        }
    }

    function _v_widget_Create() {
        var obj = null;
        var s = this.curSetting;
        this.hintObj = document.createElement("span");
        this.hintObj.className = "text-danger";            //错误语的样式

        if (this.IsCtrl() || s.readonly_text === false) {
            obj = this._createDomObj(s);
            if (this.ctrlObj === null) this.ctrlObj = obj;
            if (s.readonly_text === false && obj) obj.setAttribute("disabled", "disabled");
        } else {
            obj = document.createElement("p");//只读情况
            obj.className = "vform_widget_readonly"
            //obj.innerHTML = "&nbsp;";
            this.ctrlObj = obj;
        }
        if (this.ctrlObj) {
            var wg = this;
            VForm.on(this.ctrlObj, "change", function () {
                wg.SetData({ text: obj.value, value: obj.value }, false);
            });
        }
        if (obj) {
            obj.id = MakeAnId(8) + "_" + s.id;
            this.ctrlId = obj.id;
            if (this.label) this.label.setAttribute("for", this.ctrlId);
            if (s.cls) this.cell.className = this.cell.className + " " + s.cls;
            if (s.select_name) obj.name = s.select_name;
            if (s.value !== undefined) this.SetValue(s.value);

            this.cell.appendChild(obj);
        }
        this.cell.appendChild(this.hintObj);
        if (s.value !== undefined) this.SetValue(s.value, true);

        //DEBUG: 便于测试的特性
        {
            this.dom.setAttribute("role", "dom");
            this.cell.setAttribute("role", "cell");
            if (this.label) this.label.setAttribute("role", "label");
            if (this.ctrlObj) this.ctrlObj.setAttribute("role", "ctrlObj");
        }
    }

    function _v_widget_GetData() {
        if (this.data.text === this.data.value) return this.data.value;
        return this.data;
    }
    function _v_widget_GetText() {
        return this.I18N(this.data.text);
    }
    function _v_widget_GetValue(isString) {
        return isString === true ? this.ToString() : this.data.value;
    }
    function _v_widget_ToString(isString) {
        return JSON.stringify(this.data.value);
    }
    function _v_widget_SetData(data, isRefresh) {
        var t, v;
        if (typeof (data) === "string" || typeof (data) === "number") {
            t = v = data;
        } else {
            t = data.text;
            v = data.value;
        }
        this.SetText(t, isRefresh);
        this.SetValue(v, isRefresh);
    }
    function _v_widget_SetText(text, isRefresh) {
        this.data.text = text;
        if (isRefresh !== false) this.Refresh("text");
    }
    function _v_widget_SetValue(value, isRefresh) {
        this.data.value = value;
        var rsl = this.Check();
        if (isRefresh !== false) this.Refresh("value");
    }
    function _v_widget_IsCtrl() {
        //TODO:处理node_code的可控制权限
        return (this.curSetting.readonly !== true);// && this.curSetting.node_code
    }
    function _v_widget_Focus() {
        return this.ctrlObj ? this.ctrlObj.focus() : false;
    }

    function _v_widget_GetOption() {
        return this.curSetting;
    }

    function _v_widget_Refresh(type) {
        if (this.IsCtrl() && this.ctrlObj) {
            switch (type) {
                case "value":
                    this.ctrlObj.value = this.GetValue();
                    break;
            }
        } else {
            //TODO: 『通用控件』【只读】状态下的值设置
            //document.getElementById(this.ctrlId).innerText = this.GetText();
            this.ctrlObj.innerText = this.GetText();
        }
    }

    //校验控件的所有规则
    function _v_widget_Check() {
        var rsl = true;
        if (VForm.Validate) {
            for (var x in this.curSetting.validate) {
                var options = this.curSetting.validate[x];
                var rsl = VForm.Validate[x] ? VForm.Validate[x](this, options) : true;
                if (rsl !== true) {
                    rsl = { name: this.curSetting.name, errinfo: rsl, id: this.curSetting.id, options: options };
                    break;
                }
            }
        }
        this.SetHint(rsl);
        return rsl;
    }

    //FIXME: 尚未完成的错误提示
    function _v_widget_SetHint(hint) {
        var isErr = hint !== "" && hint !== true;

        if (isErr) {
            this.cell.className = this.cell.className + " vform_widget_error";
            if (hint.name && hint.errinfo) {
                hint.name = this.I18N(hint.name);
                hint.errinfo = this.I18N(hint.errinfo);
                this.hintObj.innerHTML = VForm.Format(hint);
            }else if(typeof(hint)==="string"){
                this.hintObj.innerHTML = hint;
            }
        } else {
            this.cell.className = this.cell.className.replace(/\s*vform_widget_error\s*/igm, " ");
            this.hintObj.innerHTML = "";
        }
    }

    //定义控件    
    VFWidgetFactory.AddWidget("text,number,password,button,email,search,address,textarea", function (setting, vform) {
        //继承父类
        vfWidget.call(this, setting, vform);

        //重载子类方法
        this._createDomObj = function () {
            var t = setting.type;
            var obj = document.createElement(t === "textarea" ? t : "input");

            try {
                obj.setAttribute("type", t);
            } catch (e) {
                obj.type = "text";
                var ck = [];
                ck["number"] = "isnum";

                if (!this.curSetting.validate) this.curSetting.validate = {};
                this.curSetting.validate[ck[t]] = true;

                console.log("浏览器不支持类型：" + setting.type + "，已使用text替代。");
            }

            if (setting.placeholder) obj.setAttribute("placeholder", setting.placeholder);
            if (setting.type !== "button") obj.className = "form_control vform_widget_text";

            return obj;
        }

        super_SetValue = this.SetValue;
        this.SetValue = function (value, isRefresh) {
            this.SetText(value);
            super_SetValue.call(this, value, false);
            if (isRefresh !== false) this.Refresh("value");
        }

        this.Create();
        this.Refresh("value");
        return this;
    });

    VFWidgetFactory.AddWidget("checkbox,radio", function (setting, vform) {
        //继承父类
        vfWidget.call(this, setting, vform);
        var s = setting;
        var n = s.select_name || MakeAnId(10);
        this.idxhash = {};//缓存的checkbox、radio,可通过value值快速查找。

        //根据options里的选项，进行初始化
        this._CreateByOptions = function () {
            var ss = this.curSetting;
            if (!ss.options || ss.options.length == 0) return;

            for (var i = 0; i < ss.options.length; i++) {
                var fc = document.createElement("div");
                fc.className = "form_check form_check_inline align_middle"

                var o = document.createElement("input");
                var id = MakeAnId(8);
                o.type = s.type;
                o.name = n;
                o.value = ss.options[i].value;
                o.setAttribute("data-text", ss.options[i].text);
                if (ss.readonly_text === false) o.setAttribute("disabled", "disabled");
                o.id = id;
                o.className = "form_check_input";
                this.idxhash[o.value] = o;

                var wg = this;
                VForm.on(o, "change", function () {
                    var r = [];
                    for (var val in wg.idxhash) {
                        var ob = wg.idxhash[val];
                        if (ob.checked)
                            r.push({ text: ob.getAttribute("data-text"), value: ob.value });
                    }
                    if (s.type === "radio") r = r[0];
                    wg.SetData(r, false);
                });

                var l = document.createElement("label");
                l.innerText = this.I18N(ss.options[i].text);
                l.setAttribute("for", id);
                l.className = "form_check_input"

                fc.appendChild(o);
                fc.appendChild(l);
                this.cell.appendChild(fc);
            }
            this.cell.className += " form_check"
        }

        //重载子类方法
        this._createDomObj = function () {
            if (!s.options || s.options.length == 0)
                this._LoadFromOptions();

            this._CreateByOptions();
            return null;
        }

        //TODO: 完成checkbox和radio的【数据源】加载
        this._LoadFromOptions = function () {
            console.warn("需要加载数据源");
        }

        this.Create();

        var super_SetData = this.SetData;
        this.SetData = function (d, isRefresh) {
            if (d.text !== undefined && d.value !== undefined) super_SetData.bind(this)(d, isRefresh);
            else if (Array.isArray(d)) {
                var txt = [];
                var val = [];
                for (var x in d) {
                    if (typeof (d[x]) === "object") {
                        txt.push(d[x].text);
                        val.push(d[x].value);
                    } else {
                        val.push(d[x]);
                    }
                }
                super_SetData.bind(this)({ text: txt, value: val }, isRefresh);
            } else if (typeof (d) === "string") {
                super_SetData.bind(this)({ text: d, value: d }, isRefresh);
            }
        }


        this.Refresh = function (type) {
            if (this.IsCtrl()) {
                switch (type) {
                    case "text":
                        if (this.data.text.length > 0) {
                            //TODO:根据text标签设置checkbox内容 【Refresh-text】
                        }
                        break;
                    case "value":
                        for (var o in this.idxhash) {
                            this.idxhash[o].removeAttribute("checked");
                        }
                        for (var i = 0; i < this.data.value.length; i++) {
                            var v = this.data.value[i];
                            if (this.idxhash[v]) this.idxhash[v].setAttribute("checked", "checked");
                        }
                        break;
                }
            } else {
                //TODO: 『checkbox|radio』【只读】状态下的值设置
                //document.getElementById(this.ctrlId).innerText = this.GetText();
            }
        }

        return this;
    });

    
    //Select控件
    VFWidgetFactory.AddWidget("select", function (setting, vform) {
        vfWidget.call(this, setting, vform);
        var s = setting;
        var n = s.select_name || MakeAnId(10);
        this.idxhash = {};

        var unselectString = "-!us!-";
        this._createDomObj = function(cs){
            var obj = document.createElement("select");
            obj.className = "vform_widget_text";
            cs.options.unshift({text:"= 请选择 =",value:unselectString})
            for(var v = 0;v<cs.options.length;v++){      //TODO: 选项是异步加载的情况
                var o = document.createElement("option");
                o.innerText = this.I18N(cs.options[v].text);
                o.setAttribute("value",cs.options[v].value);
                obj.appendChild(o);
            }

            var wg = this;
            VForm.on(obj, "change", function () {
                var r = [];
                for (var i=0;i<obj.selectedOptions.length;i++) {
                    if(obj.selectedOptions[i].value === unselectString) continue;
                    r.push({ text: obj.selectedOptions[i].text, value: obj.selectedOptions[i].value });
                }
                if(r.length ===1) r=r[0];
                wg.SetData(r, false);
            });

            this.cell.appendChild(obj);
            return null;
        }

        this.Create();
        return this;
    });

    //TODO: Table控件
    VFWidgetFactory.AddWidget("table", function (setting, vform) {
        //继承父类
        vfWidget.call(this, setting, vform);

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
                var w = VFWidgetFactory.GetWidget(s.widgets[c], vform);
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
                obj.setAttribute("class", "table table_bordered");
                $(obj).DataTable();
            }
            return obj;
        }

        this.Create();
        return this;
    });
})();