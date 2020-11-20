package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.exception.ConflictWithTheCurrentWarehouseStateException;
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

import static org.springframework.http.HttpStatus.CONFLICT;
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
        String[] split = request.getRequestURI().trim().split("/");
        if (split.length >= 3) {
            threadLocal.set(Long.parseLong(split[2]));
        }
    }

    @ExceptionHandler(ConflictWithTheCurrentWarehouseStateException.class)
    public ResponseEntity<Object> handleConflict(ConflictWithTheCurrentWarehouseStateException ex) {
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), CONFLICT.value()), new HttpHeaders(), CONFLICT);
    }

}
