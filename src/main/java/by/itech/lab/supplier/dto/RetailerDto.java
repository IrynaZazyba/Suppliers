package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Warehouse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class RetailerDto implements BaseDto {

    private Long id;
    private String fullName;
    private String identifier;
    private LocalDate deletedAt;
    private Boolean active;
    private Long customerId;
    private Set<WarehouseDto> warehouses = new HashSet<>();
}
