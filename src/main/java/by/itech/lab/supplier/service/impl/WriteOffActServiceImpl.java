package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.WriteOffAct;
import by.itech.lab.supplier.dto.WriteOffActDto;
import by.itech.lab.supplier.dto.WriteOffActReasonDto;
import by.itech.lab.supplier.dto.mapper.WriteOffActMapper;
import by.itech.lab.supplier.dto.mapper.WriteOffActReasonMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.WriteOffActRepository;
import by.itech.lab.supplier.repository.WriteOffReasonRepository;
import by.itech.lab.supplier.service.WriteOffActService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class WriteOffActServiceImpl implements WriteOffActService {

    private WriteOffActRepository writeOffActRepository;
    private WriteOffReasonRepository writeOffReasonRepository;
    private WriteOffActMapper writeOffActMapper;
    private WriteOffActReasonMapper writeOffActReasonMapper;

    @Override
    public Page<WriteOffActDto> findAll(final Pageable pageable) {
        return writeOffActRepository.findAllByOrderByDate(pageable)
                .map(writeOffActMapper::map);
    }

    @Override
    @Transactional
    public WriteOffActDto save(final WriteOffActDto dto) {
        WriteOffAct actToCreate = writeOffActMapper.map(dto);
        actToCreate = writeOffActMapper.mapItems(actToCreate);
        actToCreate.setDate(LocalDate.now());
        return writeOffActMapper.map(writeOffActRepository.save(actToCreate));
    }

    @Override
    public WriteOffActDto findById(final Long id) {
        return writeOffActRepository.findById(id)
                .map(writeOffActMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Reason with id=" + id + " doesn't exist"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        writeOffActRepository.deleteById(id, LocalDate.now());
    }

    @Override
    public List<WriteOffActReasonDto> findReasons(String reasonName) {
        return writeOffReasonRepository.findByReasonStartingWith(reasonName).stream()
                .map(writeOffActReasonMapper::map).collect(Collectors.toList());
    }
}
