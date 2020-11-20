package by.itech.lab.supplier.service;


import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.mapper.ApplicationMapper;
import by.itech.lab.supplier.dto.mapper.ApplicationItemMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.ApplicationRepository;
import by.itech.lab.supplier.repository.ApplicationItemRepository;
import by.itech.lab.supplier.service.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class ApplicationServiceTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationMapper applicationMapper;

    private Application application;
    private ApplicationDto applicationDto;
    private PageRequest pageRequest;

    @BeforeEach
    void initializeFields() {
        application = Application.builder()
                .id(17L)
                .number("Test")
                .wayBill(null)
                //.lastUpdatedByUsers(null)
                .lastUpdated(LocalDate.now())
                //.createdByUsers(null)
                .sourceLocationAddress(null)
                .registrationDate(LocalDate.now())
                .applicationStatus(ApplicationStatus.OPEN)
                .deletedAt(LocalDate.now())
                .build();
        applicationDto = ApplicationDto.builder()
                .id(17L)
                .number("Test")
                .wayBillDto(null)
                //.lastUpdatedByUsersDto(null)
                .lastUpdated(LocalDate.now())
                //.createdByUsersDto(null)
                .sourceLocationDto(null)
                .registrationDate(LocalDate.now())
                .applicationStatus(ApplicationStatus.OPEN)
                .deletedAt(LocalDate.now())
                .build();
        pageRequest = PageRequest.of(0, 10);
    }

    @Test
    void getAllApplicationsTest() {
        List<Application> applicationList = Collections.singletonList(application);
        List<ApplicationDto> applicationDtoList = Collections.singletonList(applicationDto);
        Page<ApplicationDto> applicationDtoPage = new PageImpl<>(applicationDtoList);
        Page<Application> applicationPage = new PageImpl<>(applicationList);

        Mockito.when(applicationRepository.findAll(pageRequest, true, null)).thenReturn(applicationPage);
        Mockito.when(applicationMapper.map(application)).thenReturn(applicationDto);

        Assertions.assertEquals(applicationDtoPage, applicationService.findAll(pageRequest, true, null));

    }

    @Test
    void getApplicationByIdTest_Positive() {
        Mockito.when(applicationRepository.findById(17L)).thenReturn(Optional.of(application));
        Mockito.when(applicationMapper.map(application)).thenReturn(applicationDto);

        Assertions.assertEquals(applicationDto, applicationService.findById(17L));
    }

    @Test
    void getApplicationByIdTest_Negative() {
        Mockito.when(applicationRepository.findById(130L)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class, () -> applicationService.findById(130L));
    }

    @Test
    void getApplicationByNumberTest_Positive() {
        Mockito.when(applicationRepository.findByNumber("Test")).thenReturn(Optional.of(application));
        Mockito.when(applicationMapper.map(application)).thenReturn(applicationDto);

        Assertions.assertEquals(applicationDto, applicationService.findByNumber("Test"));
    }

    @Test
    void getApplicationByNumberTest_Negative() {
        Mockito.when(applicationRepository.findByNumber("Test")).thenReturn(Optional.empty());


        Assertions.assertThrows(ResourceNotFoundException.class, () -> applicationService.findByNumber("Test"));
    }

    @TestConfiguration
    static class Config {

        @MockBean
        private ApplicationRepository applicationRepository;

        @MockBean
        private ApplicationMapper applicationMapper;

        @MockBean
        private ApplicationItemRepository itemInApplicationRepository;

        @MockBean
        private ApplicationItemMapper itemsInApplicationMapper;

        @Bean
        public ApplicationService applicationService() {
            return new ApplicationServiceImpl(applicationRepository,
                    applicationMapper,
                    itemInApplicationRepository,
                    itemsInApplicationMapper);
        }

    }
}
