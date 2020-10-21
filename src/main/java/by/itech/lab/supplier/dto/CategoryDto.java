package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Item;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class CategoryDto implements DefaultDto {

    private Long id;
    private String category;
    private Double taxRate;
    private Set<Item> items = new HashSet<>();
    private boolean active;

}