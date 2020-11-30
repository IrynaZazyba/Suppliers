package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.exception.ConflictWithTheCurrentWarehouseStateException;
import by.itech.lab.supplier.exception.DefaultExceptionInfo;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
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

    @Override
    @ResponseBody
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatus status,
                                                                  WebRequest request) {
        Map<String, String> errors = ex.getBindingResult().getAllErrors().stream()
                .collect(Collectors.toMap(
                        e -> ((FieldError) e).getField(),
                        e -> Objects.nonNull(e.getDefaultMessage()) ? e.getDefaultMessage() : "error"));
        return ResponseEntity.status(BAD_REQUEST).body(errors);
    }

}
