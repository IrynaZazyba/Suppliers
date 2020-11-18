package by.itech.lab.supplier.domain;

public enum ApplicationType {
    SUPPLY("Supply"), TRAFFIC("Traffic");

    private String type;

    ApplicationType(final String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
