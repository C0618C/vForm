function MakeAnId(l){
    var t = "abcdefghijklmnopqrstuvwxyz_";
    var id = [];
    for(var i = 0;i<l;i++){
        var r = Math.floor(Math.random() * 1000 % t.length);
        var s = t[r];
        if(r%3==0) s = s.toLocaleUpperCase();
        id.push(s);
    }
    return id.join('');
}

function DeepClone(obj,level){
    if(level===undefined) level = 0;
    if(level >= 10) return null;

    if(typeof(obj)!== "object")return obj;
    
    var tObj = {};
    for(var o in obj){
        tObj[o] = (typeof(obj[o]) === "object")?DeepClone(obj[o],level+1):obj[o];
    }

    return tObj;
}