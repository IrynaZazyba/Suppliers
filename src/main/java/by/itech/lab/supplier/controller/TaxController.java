package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.TaxDto;
import by.itech.lab.supplier.service.TaxService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_TAXES;

@RestController
@AllArgsConstructor
@RequestMapping(URL_TAXES)
public class TaxController {

    private final TaxService taxService;

    @GetMapping
    public List<TaxDto> getAllTaxes() {
        return taxService.getAll();
    }

}
