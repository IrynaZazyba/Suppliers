package by.itech.lab.supplier.domain;

public enum Role {
    SYSTEM_ADMIN("System admin"), ADMIN("Admin"), DISPATCHER("Dispatcher"),
    LOGISTICS_SPECIALIST("Logistics specialist"), DRIVER("Driver"),
    DIRECTOR("Director"), UNREGISTERED("Unregistered");
    private String role;

    Role(final String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
