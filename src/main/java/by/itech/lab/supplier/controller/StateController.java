package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.service.StateService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_STATES;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_STATES)

public class StateController {
    private final StateService stateService;

    @GetMapping
    public List<StateDto> getStates(@RequestParam String state) {
        return stateService.findByStates(state);
    }

}
