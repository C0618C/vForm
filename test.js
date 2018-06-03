(function () {
    var vf = new VForm();

    //Object.getPrototypeOf(VForm).T = function(x){alert(x)}
    //VForm.T(1);


    //
    var t = VFWidgetFactory.GetWidget({
        "id": "FunAreaText","readonly":false
        , "select_name": "FunAreaText", "type": "text", "name": "功能区触点"
        , "width": 85, "node_code": "N2", "align": "left"
        , "validate": { "require": false }, "textField": "FunAreaText"
    })
    t.Create();
    document.body.appendChild(t.dom);
})()