package com.blog.core;

import java.util.HashMap;

public class Result<T> extends HashMap {
    public Result setCode(ResultCode resultCode) {
        this.put("code", resultCode.code);
        return this;
    }

    public int getCode() {
        return (int) this.get("code");
    }

    public String getMessage() {
        return (String) this.get("message");
    }

    public Result setMessage(String message) {
        this.put("message", message);
        return this;
    }

    public Object getData(String name) {
        return this.get(name);
    }

    public Result setData(String name,T data) {
        this.put(name, data);
        return this;
    }
}