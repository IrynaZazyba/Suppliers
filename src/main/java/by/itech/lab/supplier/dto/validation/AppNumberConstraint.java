package by.itech.lab.supplier.dto.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;

@Documented
@Constraint(validatedBy = AppNumberValidator.class)
@Target({FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface AppNumberConstraint {

    String message() default "Already exists app number";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
