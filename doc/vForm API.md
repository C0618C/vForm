# vForm

## API
>**`.Init()`**  
>根据传入的配置，进行初始化。
```js
var options ={
    "column":2
    ,"title":"标题"
    ,"theme":"light"
    ,"widgets":[
        //控件的配置
    ]
}
var myform = new VForm();
myform.Init(options);
```

>**`.GetData()`**  
>以对象的形式，获取整个表单的内容。

>**`.SetData()`**  
>通过向表单设置值对象，为表单中控件设置值。

>**`.GetOption()`**  
>用于取得表单当前状态

>**`.SetOption()`**  
>用于动态设置表单的状态

>**`.Reset()`**  
>重置表单上所有控件为默认值。

>**`.Check()`**  
>检查所有控件的值，是否能通过校验。

>**`.GetLastCheckMsg()`**  
>当`.Check()`结果为false时有效，以数组的形式取得校验失败的原因。



  




z









