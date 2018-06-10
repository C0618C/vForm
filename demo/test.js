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

    try{
        var vf = new VForm();
        Ajax({ url: "form.1.json" }).then(function (d) {
            vf.Init(d);
        })
        Ajax({ url: "form.json" }).then(function (d) {
            (new VForm()).Init(d);
        })
        Ajax({ url: "form.2.json" }).then(function (d) {
            (new VForm()).Init(d);
        })
        Ajax({ url: "form.3.json" }).then(function (d) {
            (new VForm()).Init(d);
        })
    }catch(e){
        (new VForm()).Init(
            {
                "column":1,"theme":"secondary"
                ,"title":"表单2"
                ,"widgets":[
                    {
                        "id": "test2"
                        , "select_name": "ss1123", "type": "radio", "name": "单选"
                        , "align": "left","options":[{"value":1,"text":"是"},{"value":0,"text":"否"}]
                        , "validate": { "require": false }
                    }
            
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "password", "name": "控件2"
                        , "align": "left","placeholder":"这是密码"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "address", "name": "地址"
                        , "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "email", "name": "邮件"
                        , "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "search", "name": "搜索"
                        , "align": "left"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "test2"
                        , "select_name": "ss112", "type": "checkbox", "name": "多选"
                        , "align": "left","options":[{"value":1,"text":"上午"},{"value":0,"text":"中午"},{"value":2,"text":"下午"},{"value":3,"text":"晚上"},{"value":4,"text":"深夜"},{"value":5,"text":"凌晨"}]
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "textarea", "name": "这是一个超长的文本标题测试相信实际应用中不会出现这么长的一个标题吧"
                        , "align": "left","value":"这是默认值"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "text", "name": "控件2"
                        , "align": "left","placeholder":"这是placeholder"
                        , "validate": { "require": false }
                    }
                    ,{
                        "id": "tesx1"
                        , "select_name": "FunAreaText2", "type": "button", "name": "控件2"
                        , "align": "left","value":"测试"
                        , "validate": { "require": false }
                    }
                ]
            }
        )
    }

    window.$vf = vf

})();