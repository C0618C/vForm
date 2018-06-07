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

    vf.Init({
        column:1
        ,widgets:[
            {
                "id": "test2"
                , "select_name": "FunAreaText", "type": "table", "name": "控件1"
                , "align": "left"
                , widgets:[
                    {
                        "id": "test2"
                        , "select_name": "FunAreaText", "type": "textarea", "name": "控件1"
                        , "node_code": "N2", "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "text", "name": "控件2"
                        , "node_code": "N2", "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "password", "name": "控件2"
                        , "node_code": "N2", "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "text", "name": "控件2"
                        , "node_code": "N2", "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "text", "name": "控件2"
                        , "node_code": "N2", "align": "left"
                        , "validate": { "require": false }
                    }
                ]
            }
        ]
    });
    window.$vf = vf
    
})();