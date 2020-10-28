package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.dto.AddressDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AddressMapper implements BaseMapper<Address, AddressDto> {
    private final ZoneMapper zoneMapper;

    @Override
    public Address map(final AddressDto addressDto) {
        return Address.builder()
          .state(addressDto.getState())
          .city(addressDto.getCity())
          .addressLine1(addressDto.getAddressLine1())
          .addressLine2(addressDto.getAddressLine2())
          .id(addressDto.getId())
          .zone(zoneMapper.map(addressDto.getZoneDto()))
          .build();
    }

    @Override
    public AddressDto map(final Address address) {
        return AddressDto.builder()
          .state(address.getState())
          .city(address.getCity())
          .addressLine1(address.getAddressLine1())
          .addressLine2(address.getAddressLine2())
          .id(address.getId())
          .zoneDto(zoneMapper.map(address.getZone()))
          .build();
    }

    public void update(final AddressDto from, final Address to) {
        to.setState(from.getState());
        to.setCity(from.getCity());
        to.setAddressLine1(from.getAddressLine1());
        to.setAddressLine2(from.getAddressLine2());
        to.setZone(zoneMapper.map(from.getZoneDto()));
    }
}
