package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Zone;
import by.itech.lab.supplier.dto.ZoneDto;
import org.springframework.stereotype.Component;


@Component
public class ZoneMapper implements BaseMapper<Zone, ZoneDto> {
    @Override
    public Zone map(final ZoneDto zoneDto) {
        return Zone.builder()
          .id(zoneDto.getId())
          .location(zoneDto.getLocation())
          .build();
    }

    @Override
    public ZoneDto map(final Zone zone) {
        return ZoneDto.builder()
          .id(zone.getId())
          .location(zone.getLocation())
          .build();
    }

    public void update(final ZoneDto from, final Zone to) {
        to.setLocation(from.getLocation());
    }
}
