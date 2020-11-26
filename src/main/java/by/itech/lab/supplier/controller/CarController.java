package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CarDto;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.service.CarService;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CAR;

@RestController
@AllArgsConstructor
@RequestMapping(ApiConstants.URL_CUSTOMER + ApiConstants.URL_CUSTOMER_ID + URL_CAR)
public class CarController {
    private final CarService carService;
    private final CustomerService customerService;

    @PostMapping
    public CarDto save(@Valid @RequestBody CarDto carDto,
                       @PathVariable Long customerId) {
        CustomerDto customerDto = customerService.findById(customerId);
        carDto.setCustomerDto(customerDto);
        return carService.save(carDto);
    }

    @GetMapping
    public Page<CarDto> getAllNotDeleted(Pageable pageable) {
        return carService.findAll(pageable);
    }

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public CarDto getById(@PathVariable Long id) {
        return carService.findById(id);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        carService.delete(id);
    }

}
