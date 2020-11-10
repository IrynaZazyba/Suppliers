package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.AddressDto;
import by.itech.lab.supplier.repository.AddressRepository;
import by.itech.lab.supplier.service.AddressService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;


    @Override
    public AddressDto save(AddressDto address) {


        return null;
    }
}
