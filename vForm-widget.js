(function () {
    var _vf_widget = [];
    function vfWidget(setting) {
        /*  */
        this.Create = null;

        this.GetData = null;
        this.GetText = null;
        this.GetValue = null;

        this.SetData = null;
        this.SetData = null;
        this.SetValue = null;

        this.Check = null;
        return this;
    }

    var _inherit = function (baseclass, childclass, param) {
        var base = new baseclass(param);
        //this = base;
        for (var a in baseclass) {
            childclass[a] = baseclass[a];
        }
        baseclass = null;
    }

    window.VFWidget = vfWidget;
})();