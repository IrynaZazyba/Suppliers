package by.itech.lab.supplier.dto.validation.waybill.constraints;

import by.itech.lab.supplier.dto.validation.waybill.CreateWaybillNumberValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;

@Documented
@Constraint(validatedBy = CreateWaybillNumberValidator.class)
@Target({FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface WaybillCreateNumberConstraint {

    String message() default "Already exists waybill number";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
