package by.itech.lab.supplier.domain;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {

    SYSTEM_ADMIN("System admin"), ADMIN("Admin"), DISPATCHER("Dispatcher"),
    LOGISTICS_SPECIALIST("Logistics specialist"), DRIVER("Driver"),
    DIRECTOR("Director");
    private String role;

    Role(final String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String getAuthority() {
        return name();
    }
}
