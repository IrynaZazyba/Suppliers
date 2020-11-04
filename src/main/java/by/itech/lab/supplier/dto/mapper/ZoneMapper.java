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
          .zone(zoneDto.getZone())
          .build();
    }

    @Override
    public ZoneDto map(final Zone zone) {
        return ZoneDto.builder()
          .id(zone.getId())
          .zone(zone.getZone())
          .build();
    }

    public void map(final ZoneDto from, final Zone to) {
        to.setZone(from.getZone());
    }
}
