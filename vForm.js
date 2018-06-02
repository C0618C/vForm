(function () {
    function VForm() {
        //--------------------Attributes------------------
        /* 表单当前数据 */
        this.data = {};
        /* 表单最新配置 */
        this.curSetting = {};
        /* 初始化设置 */
        this.baseSetting = {};
        /* vForm 状态 */
        this.status = {
            name: "vForm"
            , version: [0, 0, 1]                 //版本号
            , debug: {
                isdebug: true                //是否调试模式
            }
        };

        //APIs
        /* 根据配置初始化 */
        this.Init = _vf_init;
        /* 动态更新配置 */
        this.SetOption = _vfSetOption;
        /* 注册控件 */
        this.AddWidget = null;

        //init
        _constructor(this);
        return this;
    }

    //构造函数
    var _constructor = (function () {
        return function (vf) {
            //debug工具，接管console
            if (console) {
                if (console.trustees != undefined) return;
                var _console = console;
                console = {};
                for (var a in _console) {
                    if (typeof _console[a] !== "function")
                        console[a] = _console[a];
                    else
                    (function(a){
                        console[a] = function (x, y, z) {
                            if (!vf.status.debug.isdebug) return;
                            if( a != "trace" )_console.trace();
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

            //TODO: 初始化
        }
    })();
    //根据配置初始化
    var _vfSetOption = (function () {
        return function (config) {
            for (var cf in config) {
                this.curSetting[cf] = config[cf];
            }
        }
    })();



    window.VForm = VForm;
})();