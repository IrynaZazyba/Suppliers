package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.dto.mapper.StateMapper;
import by.itech.lab.supplier.repository.StateRepository;
import by.itech.lab.supplier.service.StateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StateServiceImpl implements StateService {

    private final StateRepository stateRepository;
    private final StateMapper stateMapper;

    @Override
    public List<StateDto> findListByState(final String state) {
        return stateRepository.findByStateStartingWith(state).stream()
                .map(stateMapper::map).collect(Collectors.toList());
    }
}
