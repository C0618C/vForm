(function (global) {
    /**
     * 通过路径获得对应的表单或控件对象
     * @param {string} param 
     */
    var _vfAPI_$_ = function (param) {
        var paths = param.split("#");
        var vform = null;
        if (paths[0] === "") paths.shift();
        var p = paths[0];
        if (p) {
            p = p.replace(/^[\s]+|\s+$/, "");
            for (var x in VForm.__vFormObject__) {
                if (VForm.__vFormObject__[x].curSetting.id === p) {
                    vform = VForm.__vFormObject__[x];
                    break;
                }
            }
        }
        if (vform && paths.length == 1) return vform;
        var w = {};
        for (var s = 1; s < paths.length && w; s++) {
            var r = paths[s].replace(/^[\s]+|\s+$/, "");
            w = vform.get(r);
        }
        return w;
    };

    /**
     * 事件绑定工具
     * @param {object} obj 待绑定事件的对象
     * @param {string} action 绑定动作
     * @param {function} fn 绑定的事件处理函数
     */
    var _vfAPI_on__ = function (obj, action, fn) {
        if (obj && obj.addEventListener) {
            obj.addEventListener(action, fn);
        } else if (obj && obj.attachEvent) {
            obj.attachEvent("on" + action, fn.bind(obj));
        }
    }

    function VForm() {
        //--------------------Attributes------------------
        /* 表单当前数据 */
        //this.data = {};
        /* 表单最新配置 */
        this.curSetting = {};
        /* 初始化设置 */
        this.baseSetting = {};
        /* vForm 状态 */
        this.status = {
            name: "vForm"
            , version: [0, 0, 2]                 //版本号
            , debug: {
                isdebug: true                //是否调试模式
            }
            , lang: "zh-cn"                     //当前语种
            , def_lang: "zh-cn"                 //默认语种
        };

        this.widgetsHash = {};                  //通过ID索引的控件对象
        this.widgets = [];
        this.dom = null;

        //APIs
        /* 根据配置初始化 */
        this.Init = _vf_init;
        /* 动态更新配置 */
        this.SetOption = _vfAPISetOption;
        this.GetOption = _vfAPIGetOption;

        /* 拿到表单数据 */
        this.GetData = _vfAPIGetData;
        /* 设置表单数据 */
        this.SetData = _vfAPISetData;
        /* 设置语言 */
        this.SetLanguage = _vfAPISetLanguage;

        /* 获取具体插件 */
        this.get = _vfAPIGet;
        /*  */
        /* 销毁 */
        this.Destroy = _vfAPIDestroy; 

        /* 检查表单数据有效性
        返回：true / [{name,errinfo},...]
         */
        this.Check = _vfAPICheck;

        /* 将默认语言翻译成目标语言 */
        this.I18N = _vfAPITranslate;

        //init
        _constructor(this);
        return this;
    }

    // *********************** 定义vForm的静态对象及静态方法 *****************************
    //所有实例化成功的静态对象列表 在Init方法里注册
    Object.getPrototypeOf(VForm).__vFormObject__ = [];

    //根据传入参数（#id #widget-id），找出需要获取的vForm对象或对应控件
    Object.getPrototypeOf(VForm).$ = _vfAPI_$_;

    //事件绑定
    Object.getPrototypeOf(VForm).on = _vfAPI_on__;


    //构造函数
    var _constructor = (function () {
        return function (vf) {
            //DEBUG: debug工具，接管console
            if (console) {
                if (console.trustees != undefined) return;
                var _console = console;
                console = {};
                for (var a in _console) {
                    if (typeof _console[a] !== "function")
                        console[a] = _console[a];
                    else
                    (function (a) {
                        console[a] = function (x, y, z) {
                            if (!vf.status.debug.isdebug) return;
                            //if (a != "trace" && _console.trace) _console.trace();
                            return _console[a](x, y, z);
                        }
                    })(a);
                }
                console.trustees = vf.status.name;
            } else {
                window.console = {
                    trustees: vf.status.name
                    , log: function () { }
                    , debug: function () { }
                }
            }
        }
    })();

    //根据配置初始化
    var _vf_init = (function () {
        return function (config) {
            this.baseSetting = config;
            this.SetOption(config);

            //创建所有控件
            for (var i = 0; i < config.widgets.length; i++) {
                var widget = VFWidgetFactory.GetWidget(config.widgets[i], this);
                this.widgets.push(widget);
                this.widgetsHash[config.widgets[i].id] = widget;
            }

            if (this.widgets.length === 1 && config.widgets[0].type === "table") {
                this.dom = this.widgets[0].cell;
                this.dom.className = "container vform vfTable";
                document.body.appendChild(this.dom);    //FIXME:vForm创建完后如何加入文档对象
                return;
            }

            var s = this.curSetting;
            this.dom = document.createElement("table");
            this.dom.setAttribute("border", 1);
            for (var cl = 0; cl < s.column * 2; cl++) {
                var c = document.createElement("col");
                if (cl % 2 == 0) c.setAttribute("width", s.name_width || "210px");
                this.dom.appendChild(c);
            }

            //vF的标题部分
            if (s.theme === undefined) s.theme = "light";
            if (s.title) {
                var tt = document.createElement("caption");
                tt.innerText = s.title;
                tt.className = "headtitle" + " bg-" + s.theme;
                this.dom.appendChild(tt);
            }

            //组装到框架里去
            var r = null;
            var rC = 0;
            var tbd = document.createElement("tbody");
            for (var i = 0; i < this.widgets.length; i++) {
                var w = this.widgets[i];
                if (rC % s.column == 0 || r == null) {
                    r = document.createElement("tr");
                    r.className = "vf_row vform_row";
                }
                rC += 1;

                var d = document.createElement("td");
                if (w.label) d.appendChild(w.label);
                r.appendChild(d);
                var c = document.createElement("td");
                if (w.cell) c.appendChild(w.cell);
                r.appendChild(c);

                tbd.appendChild(r);
            }
            this.dom.appendChild(tbd);

            //合并列的计算 控件跨列的处理
            if (this.widgets.length % s.column !== 0) {
                var c = document.createElement("td");
                c.setAttribute("colspan", (s.column - this.widgets.length % s.column) * 2);
                r.appendChild(c);
            }

            this.dom.className = "container vform";
            document.body.appendChild(this.dom);    //FIXME:vForm创建完后如何加入文档对象

            VForm.__vFormObject__.push(this);
        }
    })();
    //根据配置初始化
    var _vfAPISetOption = function (config) {
        for (var cf in config) {
            this.curSetting[cf] = config[cf];
        }
    }
    var _vfAPIGetOption = function () {
        var r = {};
        for (var cf in this.curSetting) {
            if (typeof (this.curSetting[cf]) !== "function" && cf != "widgets")
                r[cf] = this.curSetting[cf];
        }
        return r;
    }

    /**
     * 设置语言
     * @param {string} language 
     */
    var _vfAPISetLanguage = function (language) {
        if(VForm.InitLang === undefined) return;//没引入语言模块
        if(!VForm.InitLang(language)) return;//引用语言包失败
        this.status.lang = language;
    }

    //取得表单数据
    var _vfAPIGetData = function (idx) {
        idx = idx || "id";
        var d = {};
        for (var i = 0; i < this.widgets.length; i++) {
            var sname = this.widgets[i].GetOption()[idx];
            if (!sname) continue;
            d[sname] = this.widgets[i].GetData();
        }
        return d;
    }
    //设置表单数据
    //data格式 ：{id:{text:"",value:""}|[,id:""][,...]}
    var _vfAPISetData = function (data, sname) {
        sname = sname || "id";
        for (var d in data) {
            if (sname === "id") this.widgetsHash[d].SetData(data[d]);
            else {
                for (var w = 0; w < this.widgets.length; w++) {
                    var o = this.widgets[w].GetOption();
                    if (o[sname] === d) this.widgets[w].SetData(data[d]);
                }
            }
        }
    };

    //更新错误状态，正确处理错误提示
    function _vf_ResetErr(result) {
        var hash ={};
        for (var i = 0; i < result.length; i++) {
            result[i].name = this.I18N(result[i].name);
            result[i].errinfo = this.I18N(result[i].errinfo);
            hash[result[i].id]=result[i];
        }
        for (var id in this.widgetsHash) {
            if(hash[id] === undefined) continue;
            var rsl = "";
            rsl = VForm.Format(hash[id]);
            this.widgetsHash[id].SetHint(rsl);
        }
    }
    /**
     * 检查表单数据有效性
     * @returns true | [{name,errinfo},...]
     */
    var _vfAPICheck = function () {
        var result = [];

        for (var w = 0; w < this.widgets.length; w++) {
            var r = this.widgets[w].Check();
            if (r !== true) {
                r.form = this.curSetting.title;
                result.push(r);
            }
        }

        _vf_ResetErr.bind(this)(result);
        return result.length === 0 ? true : result;
    }

    /* 根据id获取元素 */
    var _vfAPIGet = function (id) {
        return this.widgetsHash[id];
    }


    /**
     * 翻译工具
     * @param {string} text 需要翻译的文本
     * @param {string} lang 需要翻译的语种，默认为空，取status.lang中设置
     */
    var _vfAPITranslate = function(text,lang){
        if(lang === undefined) lang = this.status.lang;
        if(lang === this.status.def_lang) return text;

        if(VForm.I18N[lang] && VForm.I18N[lang][text] !== undefined) return VForm.I18N[lang][text];

        console.warn("["+lang+"]需要翻译："+text);
        return text;
    }

    //销毁表格
    var _vfAPIDestroy = function(){
        this.dom.remove();
        this.widgets=[];
        this.widgetsHash = {};
        this.dom = null;
    }

    global.VForm = VForm;
    return VForm;
}(typeof window !== "undefined" ? window : this));