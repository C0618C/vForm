(function () {

    //Object.getPrototypeOf(VForm).T = function(x){alert(x)}
    //VForm.T(1);


    // var t = VFWidgetFactory.GetWidget({
    //     "id": "FunAreaText"
    //     , "select_name": "FunAreaText", "type": "textarea", "name": "功能区触点"
    //     , "width": 85, "node_code": "N2", "align": "left"
    //     , "validate": { "require": false }, "textField": "FunAreaText"
    // })
    // t.Create();
    // document.body.appendChild(t.dom);
    // window.test = t;

    try {
        var waper = document.getElementById("waper");
        var vf = new VForm();
        vf.SetLanguage("en");
        Ajax({ url: "form.1.json", method: "GET" }).then(function (d) {
            waper.appendChild(vf.Init(d));
        })
        Ajax({ url: "form.json", method: "GET" }).then(function (d) {
            waper.appendChild((new VForm()).Init(d));
        })
        Ajax({ url: "form.2.json", method: "GET" }).then(function (d) {
            waper.appendChild((new VForm()).Init(d));
        })
        Ajax({ url: "form.3.json", method: "GET" }).then(function (d) {
            waper.appendChild((new VForm()).Init(d));
        })
        window.$vf = vf

    } catch (e) {

    }

})();