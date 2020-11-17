package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.service.StateService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping(ApiConstants.URL_STATES)
public class StateController {

    private final StateService stateService;

    @GetMapping()
    public Page<StateDto> getStates(@PageableDefault(size = 50, sort = {"id"},
            direction = Sort.Direction.DESC) final Pageable pageable) {
        return stateService.findAll(pageable);
    }

}
