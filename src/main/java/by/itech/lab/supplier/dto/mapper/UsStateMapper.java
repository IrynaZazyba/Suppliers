package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.UsState;
import by.itech.lab.supplier.dto.UsStateDto;
import org.springframework.stereotype.Component;


@Component
public class UsStateMapper implements BaseMapper<UsState, UsStateDto> {

    @Override
    public UsState map(final UsStateDto dto) {
        return UsState.builder()
                .id(dto.getId())
                .state(dto.getState())
                .build();
    }

    @Override
    public UsStateDto map(final UsState entity) {
        return UsStateDto.builder()
                .id(entity.getId())
                .state(entity.getState())
                .build();
    }

    public void map(final UsStateDto from, final UsState to) {
        to.setState(from.getState());
    }
}
