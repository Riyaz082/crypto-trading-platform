package com.Makushev.config;

public class JwtConstant {
    public static final String SECRET_KEY = System.getenv("JWT_SECRET") != null 
            ? System.getenv("JWT_SECRET") 
            : "fdsfsdfdsfdsjlfsdfjsdkfjsdfjdsklfjekjrjwerjejfdsfjdsofudsfsdf";

    public static final String JWT_HEADER="Authorization";

}
