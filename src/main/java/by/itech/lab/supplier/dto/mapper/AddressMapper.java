package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.dto.AddressDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AddressMapper implements BaseMapper<Address, AddressDto> {

    private final UsStateMapper stateMapper;

    @Override
    public Address map(final AddressDto addressDto) {
        return Address.builder()
                .city(addressDto.getCity())
                .addressLine1(addressDto.getAddressLine1())
                .addressLine2(addressDto.getAddressLine2())
                .id(addressDto.getId())
                .state(stateMapper.map(addressDto.getState()))
                .latitude(addressDto.getLatitude())
                .longitude(addressDto.getLongitude())
                .build();
    }

    @Override
    public AddressDto map(final Address address) {
        return AddressDto.builder()
                .city(address.getCity())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .id(address.getId())
                .state(stateMapper.map(address.getState()))
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .build();
    }

    public void map(final AddressDto from, final Address to) {
        to.setCity(from.getCity());
        to.setAddressLine1(from.getAddressLine1());
        to.setAddressLine2(from.getAddressLine2());
        to.setState(stateMapper.map(from.getState()));
        to.setLatitude(from.getLatitude());
        to.setLongitude(from.getLongitude());
    }
}
