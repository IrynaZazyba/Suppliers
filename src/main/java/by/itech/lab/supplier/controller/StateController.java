package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.service.impl.StateServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_STATES;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_STATES)

public class StateController {
    private final StateServiceImpl stateService;

    @GetMapping
    public Page<StateDto> findAll(@PageableDefault final Pageable pageable) {
        return stateService.findAll(pageable);
    }
}
