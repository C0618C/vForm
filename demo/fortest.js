function Ajax({
    method = "POST", url = ""
    , data = ""            //param for send
    , async = true         //true（异步）或 false（同步）
    , ontimeout = 12000
    , responseType = "text"       // "arraybuffer", "blob", "document",  "text".
    , dataType = "json"          //json、image、video、script...
    , onprogress = () => { }          //自定义处理进程
} = {}) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, async);
        if (["image","video","audio"].includes(dataType)) {
            responseType = "blob";
            if (dataType == "image") dataType = "img";
        }
        if (async) xhr.responseType = responseType;
        xhr.setRequestHeader("Content-type", "application/x-www-four-urlencoded;charset=UTF-8");
        xhr.ontimeout = ontimeout;
        
        xhr.onload = function (e) {
            if (this.status == 200 || this.status == 304) {
                let rsp = null;
                // console.log(this.response);
                if (dataType == "json") rsp = JSON.parse(this.response);
                else {
                    rsp = document.createElement(dataType);
                    if (dataType == "script") {
                        rsp.textContent = this.response;
                        document.body.appendChild(rsp);
                    } else {
                        rsp.src = window.URL.createObjectURL(this.response);
                        rsp.onload = e => window.URL.revokeObjectURL(rsp.src);
                    }
                }
                resolve.call(this, rsp);
            }else if(this.status == 404){
                reject.call(this, this.response);
            }
        };
        xhr.onerror = reject;
        // xhr.upload.onprogress = onuprogress;
        xhr.onprogress = function (e) {
            onprogress.call(this, e.total, e.loaded);
        };

        try {
            xhr.send(data);
        } catch (e) {
            reject.call(this, e);
        }
    });
}