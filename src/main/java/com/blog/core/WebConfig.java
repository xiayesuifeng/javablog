package com.blog.core;

import com.google.gson.Gson;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new PermissionHandlerInterceptor())
                .addPathPatterns("/api/logout*", "/api/article*", "/api/category*", "/api/comment*");
    }

    @Override
    public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        resolvers.add((request, response, handler, ex) -> {
            Result result = new Result();
            if (ex instanceof NoHandlerFoundException) {
                result.setCode(ResultCode.NOT_FOUND).setMessage(request.getRequestURI() + "not found");
            } else if (ex instanceof ServletException) {
                result.setCode(ResultCode.FAIL).setMessage(ex.getMessage());
            } else {
                result.setCode(ResultCode.INTERNAL_SERVER_ERROR).setMessage("内部错误");
            }
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-type", "application/json;charset=UTF-8");
            response.setStatus(200);
            try {
                response.getWriter().write(new Gson().toJson(result));
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            return new ModelAndView();
        });
    }
}
