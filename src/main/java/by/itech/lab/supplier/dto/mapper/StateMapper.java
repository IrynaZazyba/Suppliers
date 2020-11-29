package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.State;
import by.itech.lab.supplier.dto.StateDto;
import org.springframework.stereotype.Component;


@Component
public class StateMapper implements BaseMapper<State, StateDto> {

    @Override
    public State map(final StateDto dto) {
        return State.builder()
                .id(dto.getId())
                .state(dto.getState())
                .build();
    }

    @Override
    public StateDto map(final State entity) {
        return StateDto.builder()
                .id(entity.getId())
                .state(entity.getState())
                .build();
    }

    public void map(final StateDto from, final State to) {
        to.setState(from.getState());
    }
}
