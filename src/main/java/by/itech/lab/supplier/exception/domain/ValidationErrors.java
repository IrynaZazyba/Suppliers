package by.itech.lab.supplier.exception.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ValidationErrors {

    private List<String> validationMessages=new ArrayList<>();

    public void addValidationMessage(final String message){
        validationMessages.add(message);
    }

}
