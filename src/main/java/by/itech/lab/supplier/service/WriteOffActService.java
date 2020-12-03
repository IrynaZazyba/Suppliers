package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.WriteOffActDto;
import by.itech.lab.supplier.dto.WriteOffActReasonDto;

import java.util.List;

public interface WriteOffActService extends BaseSimpleService<WriteOffActDto> {

    List<WriteOffActReasonDto> findReasons(String reasonName);

}
