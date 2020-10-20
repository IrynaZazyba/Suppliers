package by.itech.lab.supplier.auth;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class UserImpl extends org.springframework.security.core.userdetails.User {

    private static final long serialVersionUID = 2403758130184537815L;
    private String customerName;

    public UserImpl(String username, String customerName, String password, boolean enabled,
                    boolean accountNonExpired, boolean credentialsNonExpired,
                    boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.customerName = customerName;
    }

    public String getCustomerName() {
        return customerName;
    }
}
