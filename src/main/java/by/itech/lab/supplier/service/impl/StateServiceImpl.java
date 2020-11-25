package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.dto.mapper.StateMapper;
import by.itech.lab.supplier.repository.StateRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StateServiceImpl implements by.itech.lab.supplier.service.StateService {
    private final StateRepository stateRepository;

    private final StateMapper stateMapper;


    @Override
    public Page<StateDto> findAll(Pageable pageable) {
        return stateRepository.findAll(pageable)
                .map(stateMapper::map);
    }

}
