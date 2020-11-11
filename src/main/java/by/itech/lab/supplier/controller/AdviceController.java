package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.exception.DefaultExceptionInfo;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@ControllerAdvice
public class AdviceController extends ResponseEntityExceptionHandler {

    ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> tagHandler(ResourceNotFoundException ex) {
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), NOT_FOUND.value()), new HttpHeaders(), NOT_FOUND);
    }


    @ModelAttribute
    public void contextListener(HttpServletRequest request) {
        String[] split = request.getRequestURI().split("/");
        int id = 0;
        if (split.length >= 1) {
            id = Integer.parseInt(split[1]);
        }
        System.out.println(id);

    }

}
