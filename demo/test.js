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

    var vf = new VForm();
    Ajax({url:"form.1.json"}).then(function(d){
        vf.Init(d);
    })
    Ajax({url:"form.json"}).then(function(d){
        (new VForm()).Init(d);
    })

    window.$vf = vf
    
})();