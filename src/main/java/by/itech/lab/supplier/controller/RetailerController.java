package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.advisor.AdminAccess;
import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.RetailerDto;
import by.itech.lab.supplier.service.RetailerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import java.util.Optional;

import static by.itech.lab.supplier.constant.ApiConstants.*;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_RETAILER)
public class RetailerController {
    private final RetailerService retailerService;

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public Optional<RetailerDto> getRetailer(@PathVariable Long id) {
        log.debug("request to get User : {}", id);
        return retailerService.findById(id);
    }


    @GetMapping
    public Page<RetailerDto> getAllByActive(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) final Pageable pageable,
            @RequestParam(required = false) final Boolean status) {
        return retailerService.findAllByActive(pageable, status);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RetailerDto createUser(@RequestBody RetailerDto retailerDto) {
        return retailerService.save(retailerDto);
    }


    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.OK)
    public RetailerDto updateRetailer(@PathVariable Long id, @RequestBody RetailerDto retailerDto) {
        retailerDto.setId(id);
        return retailerService.save(retailerDto);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @AdminAccess
    public void deleteRetailer(@PathVariable Long id) {
        retailerService.delete(id);
    }

}
