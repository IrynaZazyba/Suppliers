package by.itech.lab.supplier.domain;

public enum WarehouseType {
    FACTORY("Factory"), WAREHOUSE("Warehouse"), RETAILER("Retailer");

    private String type;

    WarehouseType(final String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
