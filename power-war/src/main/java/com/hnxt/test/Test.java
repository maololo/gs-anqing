package com.hnxt.test;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import com.hnxt.basic.core.App;

@SpringBootApplication
@ComponentScan(basePackages={"com.hnxt"})
public class Test 
{
    public static void main( String[] args )
    {
        SpringApplication.run(App.class,args );
    }
}