package by.itech.lab.supplier.service;


import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.mapper.ApplicationMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.ApplicationRepository;
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

import java.sql.Date;
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
    private Application deletedApplication;
    private ApplicationDto applicationDto;
    private ApplicationDto deletedApplicationDto;
    private PageRequest pageRequest;

    @BeforeEach
    void initializeFields() {
        application = Application.builder()
          .id(17L)
          .number("Test")
          .wayBill(null)
          .lastUpdatedByUsers(null)
          .lastUpdated(new Date(new java.util.Date().getTime()))
          .createdByUsers(null)
          .sourceLocationAddressId(null)
          .registrationDate(new Date(new java.util.Date().getTime()))
          .applicationStatus(ApplicationStatus.WAITING)
          .deletedAt(null)
          .deleted(false)
          .build();
        applicationDto = ApplicationDto.builder()
          .id(17L)
          .number("Test")
          .wayBillDto(null)
          .lastUpdatedByUsersDto(null)
          .lastUpdated(new Date(new java.util.Date().getTime()))
          .createdByUsersDto(null)
          .sourceLocationAddressIdDto(null)
          .registrationDate(new Date(new java.util.Date().getTime()))
          .applicationStatus(ApplicationStatus.WAITING)
          .deletedAt(null)
          .deleted(false)
          .build();
        deletedApplication = Application.builder()
          .id(18L)
          .number("Test")
          .wayBill(null)
          .lastUpdatedByUsers(null)
          .lastUpdated(new Date(new java.util.Date().getTime()))
          .createdByUsers(null)
          .sourceLocationAddressId(null)
          .registrationDate(new Date(new java.util.Date().getTime()))
          .applicationStatus(ApplicationStatus.WAITING)
          .deletedAt(null)
          .deleted(false)
          .build();
        deletedApplicationDto = ApplicationDto.builder()
          .id(18L)
          .number("Test")
          .wayBillDto(null)
          .lastUpdatedByUsersDto(null)
          .lastUpdated(new Date(new java.util.Date().getTime()))
          .createdByUsersDto(null)
          .sourceLocationAddressIdDto(null)
          .registrationDate(new Date(new java.util.Date().getTime()))
          .applicationStatus(ApplicationStatus.WAITING)
          .deletedAt(null)
          .deleted(false)
          .build();
        pageRequest = PageRequest.of(0, 10);
    }

    @Test
    void getAllApplicationsTest() {
        List<Application> applicationList = Collections.singletonList(application);
        List<ApplicationDto> applicationDtoList = Collections.singletonList(applicationDto);
        Page<ApplicationDto> applicationDtoPage = new PageImpl<>(applicationDtoList);
        Page<Application> applicationPage = new PageImpl<>(applicationList);

        Mockito.when(applicationRepository.findAllByDeleted(pageRequest, null)).thenReturn(applicationPage);
        Mockito.when(applicationMapper.map(application)).thenReturn(applicationDto);

        Assertions.assertEquals(applicationDtoPage, applicationService.findAllByDeleted(pageRequest, null));

    }

    @Test
    void getAllApplicationsByDeletedTrueTest() {
        List<Application> applicationList = Collections.singletonList(deletedApplication);
        List<ApplicationDto> applicationDtoList = Collections.singletonList(deletedApplicationDto);
        Page<ApplicationDto> applicationDtoPage = new PageImpl<>(applicationDtoList);
        Page<Application> applicationPage = new PageImpl<>(applicationList);

        Mockito.when(applicationRepository.findAllByDeleted(pageRequest, true)).thenReturn(applicationPage);
        Mockito.when(applicationMapper.map(deletedApplication)).thenReturn(deletedApplicationDto);

        Assertions.assertEquals(applicationDtoPage, applicationService.findAllByDeleted(pageRequest, true));
    }

    @Test
    void getAllApplicationsByDeletedFalseTest() {
        List<Application> applicationList = Collections.singletonList(application);
        List<ApplicationDto> applicationDtoList = Collections.singletonList(applicationDto);
        Page<ApplicationDto> applicationDtoPage = new PageImpl<>(applicationDtoList);
        Page<Application> applicationPage = new PageImpl<>(applicationList);

        Mockito.when(applicationRepository.findAllByDeleted(pageRequest, false)).thenReturn(applicationPage);
        Mockito.when(applicationMapper.map(application)).thenReturn(applicationDto);

        Assertions.assertEquals(applicationDtoPage, applicationService.findAllByDeleted(pageRequest, false));
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

        Assertions.assertThrows(NotFoundInDBException.class, () -> applicationService.findById(130L));
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


        Assertions.assertThrows(NotFoundInDBException.class, () -> applicationService.findByNumber("Test"));
    }

    @TestConfiguration
    static class Config {

        @MockBean
        private ApplicationRepository applicationRepository;

        @MockBean
        private ApplicationMapper applicationMapper;

        @Bean
        public ApplicationService applicationService() {
            return new ApplicationServiceImpl(applicationRepository, applicationMapper);
        }

    }

}
