package by.itech.lab.supplier.exception;

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
