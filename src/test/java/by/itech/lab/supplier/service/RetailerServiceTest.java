package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.dto.RetailerDto;
import by.itech.lab.supplier.dto.mapper.RetailerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.RetailerRepository;
import by.itech.lab.supplier.service.impl.RetailerServiceImpl;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class RetailerServiceTest {
    @Autowired
    private RetailerService retailerService;

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private RetailerMapper retailerMapper;

    private Retailer retailer;
    private RetailerDto retailerDto;
    private PageRequest pageRequest;

    @BeforeEach
    void initializeFields() {
        retailer = Retailer.builder()
                .id(100L)
                .fullName("Surikov")
                .identifier("246738456")
                .retailersCol("4")
                .deletedAt(null)
                .active(true)
                .customerId(3L)
                .build();
        retailerDto = RetailerDto.builder()
                .id(100L)
                .fullName("Surikov")
                .identifier("246738456")
                .retailersCol("4")
                .deletedAt(null)
                .active(true)
                .customerId(3L)
                .build();

        pageRequest = PageRequest.of(0, 10);
    }

    @Test
    public void getAllRetailersTest() {
        List<Retailer> retailerList = Collections.singletonList(retailer);
        List<RetailerDto> retailerDtoList = Collections.singletonList(retailerDto);
        Page<RetailerDto> retailerDtoPage = new PageImpl<>(retailerDtoList);
        Page<Retailer> retailerPage = new PageImpl<>(retailerList);

        Mockito.when(retailerRepository.findAll(pageRequest)).thenReturn(retailerPage);
        Mockito.when(retailerMapper.map(retailer)).thenReturn(retailerDto);

        Assertions.assertEquals(retailerDtoPage, retailerService.findAll(pageRequest));

    }

    @Test
    void getRetailerByIdTest_Positive() {
        Mockito.when(retailerRepository.findById(100L)).thenReturn(Optional.of(retailer));
        Mockito.when(retailerMapper.map(retailer)).thenReturn(retailerDto);

        Assertions.assertEquals(Optional.of(retailerDto), retailerService.findById(100L));
    }

    @Test
    void getRetailerByIdTest_Negative() {
        Mockito.when(retailerRepository.findById(100L)).thenReturn(Optional.empty());
        Mockito.when(retailerMapper.map(retailer)).thenReturn(retailerDto);

        Assertions.assertThrows(ResourceNotFoundException.class, () -> retailerService.findById(100L));
    }


    @TestConfiguration
    static class Config {

        @MockBean
        private RetailerRepository retailerRepository;

        @MockBean
        private RetailerMapper retailerMapper;


        @Bean
        public RetailerService retailerService() {
            return new RetailerServiceImpl(retailerRepository, retailerMapper);
        }

    }
}
