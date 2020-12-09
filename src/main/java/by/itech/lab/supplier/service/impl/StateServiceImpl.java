package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.dto.mapper.StateMapper;
import by.itech.lab.supplier.repository.StateRepository;
import by.itech.lab.supplier.service.StateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StateServiceImpl implements StateService {

    private final StateRepository stateRepository;
    private final StateMapper stateMapper;

    public List<StateDto> findByStates(final String state) {
        return stateRepository.findByStateStartingWith(state).stream()
                .map(stateMapper::map).collect(Collectors.toList());
    }

    @Override
    public Page<StateDto> findAll(Pageable pageable) {
        return stateRepository.findAll(pageable)
                .map(stateMapper::map);
    }
}
