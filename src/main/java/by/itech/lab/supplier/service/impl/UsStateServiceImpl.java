package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.UsStateDto;
import by.itech.lab.supplier.dto.mapper.UsStateMapper;
import by.itech.lab.supplier.repository.UsStateRepository;
import by.itech.lab.supplier.service.UsStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsStateServiceImpl implements UsStateService {

    private final UsStateRepository stateRepository;
    private final UsStateMapper usStateMapper;

    @Override
    public List<UsStateDto> findListByState(final String state) {
        return stateRepository.findByStateStartingWith(state).stream()
                .map(usStateMapper::map).collect(Collectors.toList());
    }

    @Override
    public Page<UsStateDto> findAll(Pageable pageable) {
        return stateRepository.findAll(pageable)
                .map(usStateMapper::map);
    }
}
