package by.itech.lab.supplier.exception;

import by.itech.lab.supplier.exception.domain.ValidationErrors;
import lombok.Data;

@Data
public class ValidationException extends RuntimeException {

    private static final long serialVersionUID = 8834768265063746962L;
    private ValidationErrors validationErrors;

    public ValidationException(String message, ValidationErrors validationErrors) {
        super(message);
        this.validationErrors = validationErrors;
    }

}
