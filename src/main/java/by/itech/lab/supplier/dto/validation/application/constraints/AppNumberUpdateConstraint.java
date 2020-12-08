package by.itech.lab.supplier.dto.validation.application.constraints;

import by.itech.lab.supplier.dto.validation.application.AppNumberUpdateValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {AppNumberUpdateValidator.class})
@Documented
public @interface AppNumberUpdateConstraint {

    String message() default "Already exists app number";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
