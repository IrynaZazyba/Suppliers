package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.UsStateDto;
import by.itech.lab.supplier.service.impl.UsStateServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_STATES;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_STATES)

public class StateController {
    private final UsStateServiceImpl stateService;

    @GetMapping
    public List<UsStateDto> getListByState(@RequestParam String state) {
        return stateService.findListByState(state);
    }
}
