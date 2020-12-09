package by.itech.lab.supplier.exception.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DefaultExceptionInfo {

    private String message;
    private int errorCode;

}

