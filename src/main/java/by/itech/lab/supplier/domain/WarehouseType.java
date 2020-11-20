package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum WarehouseType {
    FACTORY("Factory"),
    WAREHOUSE("Warehouse"),
    RETAILER("Retailer");

    private String type;

}
