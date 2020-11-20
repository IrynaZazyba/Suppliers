package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.dto.RetailerDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RetailerMapper implements BaseMapper<Retailer, RetailerDto> {

    @Override
    public RetailerDto map(Retailer retailer) {
        return RetailerDto.builder()
                .id(retailer.getId())
                .fullName(retailer.getFullName())
                .identifier(retailer.getIdentifier())
                .retailersCol(retailer.getRetailersCol())
                .deletedAt(retailer.getDeletedAt())
                .active(retailer.getActive())
                .customerId(retailer.getCustomerId())
                .build();
    }

    public void update(final RetailerDto from, final Retailer to) {
        to.setIdentifier(from.getIdentifier());
        to.setFullName(from.getFullName());
        to.setRetailersCol(from.getRetailersCol());
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
                .retailersCol(retailerDto.getRetailersCol())
                .deletedAt(retailerDto.getDeletedAt())
                .active(retailerDto.getActive())
                .customerId(retailerDto.getCustomerId())
                .build();
    }
}
