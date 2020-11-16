package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.exception.ConflictWithTheCurrentStateException;
import by.itech.lab.supplier.exception.DefaultExceptionInfo;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ControllerAdvice
public class AdviceController extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> tagHandler(ResourceNotFoundException ex) {
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), NOT_FOUND.value()), new HttpHeaders(), NOT_FOUND);
    }

    @ExceptionHandler(ConflictWithTheCurrentStateException.class)
    public ResponseEntity<Object> handleConflict(ConflictWithTheCurrentStateException ex) {
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), CONFLICT.value()), new HttpHeaders(), CONFLICT);
    }

}
