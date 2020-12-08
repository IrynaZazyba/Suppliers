package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.WriteOffActReason;
import by.itech.lab.supplier.dto.WriteOffActDto;
import by.itech.lab.supplier.dto.WriteOffActReasonDto;
import by.itech.lab.supplier.service.WriteOffActService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_REASON;
import static by.itech.lab.supplier.constant.ApiConstants.URL_WRITE_OFF_ACT;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_WRITE_OFF_ACT)
public class WriteOffActController {

    private WriteOffActService writeOffActService;

    @PostMapping
    public WriteOffActDto save(@Valid @RequestBody WriteOffActDto writeOffActDto,
                               @PathVariable Long customerId) {
        writeOffActDto.setCustomerId(customerId);
        return writeOffActService.save(writeOffActDto);
    }

    @GetMapping
    public Page<WriteOffActDto> getAllOrderByDate(Pageable pageable) {
        return writeOffActService.findAll(pageable);
    }

    @GetMapping(URL_ID_PARAMETER)
    public WriteOffActDto getById(@PathVariable Long id) {
        return writeOffActService.findById(id);
    }

    @GetMapping(URL_REASON)
    public List<WriteOffActReasonDto> getByName(@RequestParam String reason) {
        return writeOffActService.findReasons(reason);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        writeOffActService.delete(id);
    }
}
