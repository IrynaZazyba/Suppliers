package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.exception.DefaultExceptionInfo;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@ControllerAdvice
@RequiredArgsConstructor
public class AdviceController extends ResponseEntityExceptionHandler {

    private final ThreadLocal<Long> threadLocal;

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> tagHandler(ResourceNotFoundException ex) {
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), NOT_FOUND.value()), new HttpHeaders(), NOT_FOUND);
    }


    @ModelAttribute
    public void contextListener(HttpServletRequest request) {
        System.out.println(request.getRequestURI());
        String[] split = request.getRequestURI().trim().split("/");
        if (split.length >= 3) {
            threadLocal.set(Long.parseLong(split[2]));
        }
    }

}
