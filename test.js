(function(){
    var vf = new VForm();

    //console.log("test");

    Object.getPrototypeOf(VForm).T = function(x){alert(x)}
    VForm.T(1);

})()