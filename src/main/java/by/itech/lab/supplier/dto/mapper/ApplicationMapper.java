package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.dto.ApplicationDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class ApplicationMapper implements BaseMapper<Application, ApplicationDto> {
    @Override
    public Application map(ApplicationDto dto) {
        return null;
    }

    @Override
    public ApplicationDto map(Application entity) {
        return null;
    }
}
