package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.advisor.AdminAccess;
import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.dto.RetailerDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.service.RetailerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

import static by.itech.lab.supplier.constant.ApiConstants.*;
import static by.itech.lab.supplier.constant.ApiConstants.URL_USER;

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
    public Page<RetailerDto> getAllRetailers(@PageableDefault Pageable pageable) {
        return retailerService.findAll(pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RetailerDto createUser(@Valid @RequestBody RetailerDto retailerDto) {
        return retailerService.save(retailerDto);
    }


    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.OK)
    public RetailerDto updateRetailer(@PathVariable Long id, @Valid @RequestBody RetailerDto retailerDto) {
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
