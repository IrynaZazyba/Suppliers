package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.dto.RetailerDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class RetailerMapper implements BaseMapper<Retailer, RetailerDto> {
    private final WarehouseMapper warehouseMapper;
    @Override
    public RetailerDto map(Retailer retailer) {
        return RetailerDto.builder()
                .id(retailer.getId())
                .fullName(retailer.getFullName())
                .identifier(retailer.getIdentifier())
                .deletedAt(retailer.getDeletedAt())
                .active(retailer.getActive())
                .customerId(retailer.getCustomerId())
                .build();
    }

    public void update(final RetailerDto from, final Retailer to) {
        to.setIdentifier(from.getIdentifier());
        to.setFullName(from.getFullName());
        to.setDeletedAt(from.getDeletedAt());
        to.setActive(from.getActive());
        to.setCustomerId(from.getCustomerId());
    }

    @Override
    public Retailer map(RetailerDto retailerDto) {
        return Retailer.builder()
                .id(retailerDto.getId())
                .fullName(retailerDto.getFullName())
                .identifier(retailerDto.getIdentifier())
                .deletedAt(retailerDto.getDeletedAt())
                .active(retailerDto.getActive())
//                .warehouses(Objects.nonNull(retailerDto.getWarehouses()) ?
//                        retailerDto.getWarehouses().stream().map(warehouseMapper::map).collect(Collectors.toSet()) : null)
                .customerId(retailerDto.getCustomerId())
                .build();
    }
}
