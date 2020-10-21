package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Item;
import lombok.Data;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
public class CategoryDto implements BaseDto {

    private Long id;
    private String category;
    private BigDecimal taxRate;
    private Set<Item> items = new HashSet<>();
    private boolean active;

}
