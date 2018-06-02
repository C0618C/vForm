(function () {
    var _vf_widget = [];
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
    function _v_widget_Create(){
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

    if(window.VForm == undefined){
        console.warn("没找到vForm，控件注册失败");
        return;
    }

    var vForm = window.VForm;
    vForm.prototype.AddWidget = function(type,setting){
        if(_vf_widget[type] != undefined){
            console.warn("控件["+type+"]重复注册。");
            return;
        }

        var widget = new vfWidget(setting);

        //test
        widget.Create();

        _vf_widget[type]=widget;
    }



    window.VFWidget = vfWidget;
})();