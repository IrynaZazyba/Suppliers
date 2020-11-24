package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Car;
import by.itech.lab.supplier.dto.CarDto;
import by.itech.lab.supplier.dto.mapper.CarMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CarRepository;
import by.itech.lab.supplier.service.CarService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;


    @Override
    public CarDto findById(final Long id) {
        return carRepository.findById(id)
                .map(carMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Car with id=" + id + " doesn't exist"));
    }


    @Override
    @Transactional
    public CarDto save(final CarDto dto) {
        Car car = Optional.ofNullable(dto.getId())
                .map(carToSave -> {
                    final Car existing = carRepository
                            .findById(dto.getId())
                            .orElseThrow();
                    carMapper.map(dto, existing);
                    return existing;
                })
                .orElseGet(() -> carMapper.map(dto));

        final Car saved = carRepository.save(car);
        return carMapper.map(saved);
    }

    @Override
    public Page<CarDto> findAll(Pageable pageable) {
        return carRepository.findAll(pageable)
                .map(carMapper::map);
    }

    @Override
    public int increaseCapacity(final double capacity, Long id) {
    return carRepository.increaseCurrentCapacity(capacity, id);
    }

    @Override
    public int decreaseCapacity(final double capacity, Long id) {
        return carRepository.decreaseCurrentCapacity(capacity, id);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        carRepository.deleteById(id);
    }
}
