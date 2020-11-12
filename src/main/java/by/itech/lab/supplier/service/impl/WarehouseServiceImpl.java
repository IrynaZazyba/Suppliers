package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.AddressDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.AddressMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.AddressRepository;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final WarehouseMapper warehouseMapper;
    private final AddressMapper addressMapper;


    @Override
    public Page<WarehouseDto> findAll(final Pageable pageable) {
        return warehouseRepository.findAll(pageable).map(warehouseMapper::map);
    }

    @Override
    public WarehouseDto findById(final Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with id=" + warehouseId + " doesn't exist"));
    }

    @Transactional
    @Override
    public WarehouseDto save(final WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseMapper.map(warehouseDto);
        Address savedAddress = addressCreate(warehouseDto.getAddressDto());
        warehouse.setAddress(savedAddress);
        Customer customer = customerRepository.findById(warehouseDto.getCustomerId()).orElseThrow();
        warehouse.setCustomer(customer);
        final Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        for (User user : warehouse.getUsers()) {
            user.setWarehouse(warehouse);
            userRepository.save(user);
        }
        return warehouseMapper.map(savedWarehouse);
    }

    @Transactional
    @Override
    public WarehouseDto update(final WarehouseDto warehouseDto) {
        Warehouse entity = warehouseRepository.findById(warehouseDto.getId()).orElseThrow();
        final Address existingAddress = addressRepository.findById(entity.getAddress().getId()).orElseThrow();
        warehouseDto.getAddressDto().setId(existingAddress.getId());
        addressMapper.map(warehouseDto.getAddressDto(), existingAddress);
        addressRepository.save(existingAddress);

        Warehouse warehouse = Optional.ofNullable(warehouseDto.getId())
                .map(item -> {
                    final Warehouse existingWarehouse = warehouseRepository
                            .findById(warehouseDto.getId())
                            .orElseThrow();
                    warehouseMapper.map(warehouseDto, existingWarehouse);
                    return existingWarehouse;
                })
                .orElseThrow();

        final Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return warehouseMapper.map(savedWarehouse);
    }

    private Address addressCreate(final AddressDto addressDto) {
        Address address = addressMapper.map(addressDto);
        return addressRepository.save(address);
    }

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id);
    }
}
