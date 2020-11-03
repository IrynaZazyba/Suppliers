package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Car;
import by.itech.lab.supplier.dto.CarDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


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
          .address(addressMapper.map(dto.getAddressDto()))
          .number(dto.getNumber())
          .customer(customerMapper.map(dto.getCustomerDto()))
          .build();
    }

    @Override
    public CarDto map(final Car car) {
        return CarDto.builder()
          .id(car.getId())
          .totalCapacity(car.getTotalCapacity())
          .currentCapacity(car.getCurrentCapacity())
          .addressDto(addressMapper.map(car.getAddress()))
          .number(car.getNumber())
          .customerDto(customerMapper.map(car.getCustomer()))
          .build();
    }

    public void map(final CarDto from, final Car to) {
        to.setNumber(from.getNumber());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setCurrentCapacity(from.getCurrentCapacity());
        to.setAddress(addressMapper.map(from.getAddressDto()));
        to.setCustomer(customerMapper.map(from.getCustomerDto()));
    }

}
