package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.exception.ConflictWithTheCurrentWarehouseStateException;
import by.itech.lab.supplier.exception.ConflictWithWayPointTrackingException;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.exception.ValidationException;
import by.itech.lab.supplier.exception.domain.DefaultExceptionInfo;
import by.itech.lab.supplier.exception.domain.ValidationErrors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
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
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Log4j2
@ControllerAdvice
@RequiredArgsConstructor
public class AdviceController extends ResponseEntityExceptionHandler {

    private final ThreadLocal<Long> threadLocal;

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> tagHandler(ResourceNotFoundException ex) {
        log.error("ResourceNotFoundException: " + ex.getMessage(), ex);
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), NOT_FOUND.value()), new HttpHeaders(), NOT_FOUND);
    }


    @ModelAttribute
    public void contextListener(HttpServletRequest request) {
        log.info("{} {}, {}", request.getMethod(), request.getRequestURI(), request.getSession().getId());
        String[] split = request.getRequestURI().trim().split("/");
        if (split.length >= 3) {
            threadLocal.set(Long.parseLong(split[2]));
        }
    }

    @ExceptionHandler({ConflictWithTheCurrentWarehouseStateException.class, ConflictWithWayPointTrackingException.class})
    public ResponseEntity<Object> handleConflict(Exception ex) {
        log.error("Conflict: " + ex.getMessage(), ex);
        return new ResponseEntity<>(
                new DefaultExceptionInfo(ex.getMessage(), CONFLICT.value()), new HttpHeaders(), CONFLICT);
    }

    @Override
    @ResponseBody
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatus status,
                                                                  WebRequest request) {
        log.error("MethodArgumentNotValidException: " + ex.getMessage(), ex);
        Map<String, String> errors = ex.getBindingResult().getAllErrors().stream()
                .collect(Collectors.toMap(
                        e -> ((FieldError) e).getField(),
                        e -> Objects.nonNull(e.getDefaultMessage()) ? e.getDefaultMessage() : "error"));
        return ResponseEntity.status(BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException ex) {
        log.error("ConstraintViolationException: " + ex.getMessage(), ex);
        Map<String, String> errors = ex.getConstraintViolations().stream().collect(Collectors.toMap(
                v -> v.getPropertyPath().toString(),
                ConstraintViolation::getMessage));
        return ResponseEntity.status(BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> handleValidationException(ValidationException ex) {
        log.error("Invalid data: " +
                StringUtils.join(ex.getValidationErrors().getValidationMessages(), ", "), ex);
        ValidationErrors validationErrors = ex.getValidationErrors();
        return ResponseEntity.status(CONFLICT).body(validationErrors);
    }


}
