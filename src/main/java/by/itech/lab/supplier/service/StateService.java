package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.StateDto;

import java.util.List;

public interface StateService{

    List<StateDto> findListByState(String state);
}
