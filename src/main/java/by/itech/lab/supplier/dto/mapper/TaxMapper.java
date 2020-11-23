package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Tax;
import by.itech.lab.supplier.dto.TaxDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class TaxMapper implements BaseMapper<Tax, TaxDto> {

    private final StateMapper stateMapper;

    @Override
    public Tax map(final TaxDto dto) {
        return Tax.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .name(dto.getName())
                .percentage(dto.getPercentage())
                .state(stateMapper.map(dto.getStateDto()))
                .build();
    }

    @Override
    public TaxDto map(final Tax tax) {
        return TaxDto.builder()
                .id(tax.getId())
                .amount(tax.getAmount())
                .name(tax.getName())
                .percentage(tax.getPercentage())
                .stateDto(stateMapper.map(tax.getState()))
                .build();
    }

}
