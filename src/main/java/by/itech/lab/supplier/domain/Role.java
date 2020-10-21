package by.itech.lab.supplier.domain;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {

    ROLE_SYSTEM_ADMIN("System admin"), ROLE_ADMIN("Admin"), ROLE_DISPATCHER("Dispatcher"),
    ROLE_LOGISTICS_SPECIALIST("Logistics specialist"), ROLE_DRIVER("Driver"),
    ROLE_DIRECTOR("Director");
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
