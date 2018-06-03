if (typeof Object.getPrototypeOf !== "function")
    Object.getPrototypeOf = "".__proto__ === String.prototype
        ? function (object) {
            return object.__proto__;
        }
        : function (object) {
            return object.constructor.prototype;
        };