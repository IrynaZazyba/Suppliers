package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Car;
import by.itech.lab.supplier.dto.CarDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component
@AllArgsConstructor
public class CarMapper implements BaseMapper<Car, CarDto> {

    private final CustomerMapper customerMapper;
    private final AddressMapper addressMapper;

    @Override
    public Car map(final CarDto dto) {
        return Car.builder()
                .id(dto.getId())
                .totalCapacity(dto.getTotalCapacity())
                .currentCapacity(dto.getCurrentCapacity())
                .address(dto.getAddressDto() != null ? addressMapper.map(dto.getAddressDto()) : null)
                .number(dto.getNumber())
                .customer(Objects.nonNull(dto.getCustomerDto()) ? customerMapper.map(dto.getCustomerDto()) : null)
                .build();
    }

    @Override
    public CarDto map(final Car car) {
        return CarDto.builder()
                .id(car.getId())
                .totalCapacity(car.getTotalCapacity())
                .currentCapacity(car.getCurrentCapacity())
                .addressDto(car.getAddress() != null ? addressMapper.map(car.getAddress()) : null)
                .number(car.getNumber())
                .customerDto(Objects.nonNull(car.getCustomer()) ? customerMapper.map(car.getCustomer()) : null)
                .build();
    }

    public void map(final CarDto from, final Car to) {
        to.setNumber(from.getNumber());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setCurrentCapacity(from.getCurrentCapacity());
        to.setAddress(from.getAddressDto() != null ? addressMapper.map(from.getAddressDto()) : null);
        to.setCustomer(customerMapper.map(from.getCustomerDto()));
    }

}
