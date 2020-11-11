package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.AddressDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.AddressMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.AddressRepository;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final WarehouseMapper warehouseMapper;
    private final AddressMapper addressMapper;

    @Override
    public Page<WarehouseDto> findAll(Pageable pageable) {
        return warehouseRepository.findAll(pageable).map(warehouseMapper::map);
    }

    @Override
    public WarehouseDto findById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with id=" + warehouseId + " doesn't exist"));
    }

    @Transactional
    @Override
    public WarehouseDto save(Long customerId, WarehouseDto warehouseDto) {
        if (warehouseDto.getIdentifier() == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_ACCEPTABLE, "You can't delete \"identifier\" field");
        }

        Warehouse warehouse = warehouseMapper.map(warehouseDto);
        Address savedAddress = addressCreate(warehouseDto.getAddress());
        warehouse.setAddress(savedAddress);
        Optional<Customer> customer = customerRepository.findById(customerId);
        customer.ifPresent(warehouse::setCustomer);
        final Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return warehouseMapper.map(savedWarehouse);
    }

    @Transactional
    @Override
    public WarehouseDto update(WarehouseDto warehouseDto) {
        Warehouse entity = warehouseRepository.findById(warehouseDto.getId()).orElseThrow();
        if (!warehouseDto.getIdentifier().equals(entity.getIdentifier())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_ACCEPTABLE, "You can't change \"identifier\" field");
        }

        final Address existingAddress = addressRepository.findById(entity.getAddress().getId()).orElseThrow();
        warehouseDto.getAddress().setId(existingAddress.getId());
        addressMapper.map(warehouseDto.getAddress(), existingAddress);
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

    private Address addressCreate(AddressDto addressDto) {
        Address address = addressMapper.map(addressDto);
        return addressRepository.save(address);
    }

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id);
    }

    @Override
    public WarehouseDto save(WarehouseDto dto) {
        return null;
    }
}
