package com.blog.core;

import com.google.gson.Gson;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class PermissionHandlerInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String username = (String) request.getSession().getAttribute("username");
        if (!request.getMethod().equals("GET")) {
            if (username == null) {
                returnJson(response, "未登陆");
                return false;
            } else if (request.getRequestURI().contains("/api/comment")) {
                return true;
            } else {
                if (!username.equals("admin") && !request.getRequestURI().equals("/api/logout")) {
                    returnJson(response,"无权限");
                    return false;
                }
            }
        } else if (request.getRequestURI().equals("/api/user") && !username.equals("admin")){
            returnJson(response,"无权限");
            return false;
        }
        return true;
    }

    private void returnJson(HttpServletResponse response,String message) throws IOException {
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type", "application/json;charset=UTF-8");
        response.getWriter().write(new Gson().toJson(new Result().setCode(ResultCode.UNAUTHORIZED).setMessage(message)));
        response.setStatus(200);
    }
}
