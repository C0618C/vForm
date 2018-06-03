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