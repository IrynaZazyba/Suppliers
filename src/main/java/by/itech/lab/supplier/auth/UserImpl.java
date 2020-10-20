package by.itech.lab.supplier.auth;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

public class UserImpl extends org.springframework.security.core.userdetails.User {

    private static final long serialVersionUID = 2403758130184537815L;
    private List<CustomerDto> customer;

    public UserImpl(String username, String password, List<CustomerDto> customer, boolean enabled,
                    boolean accountNonExpired, boolean credentialsNonExpired,
                    boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.customer = customer;
    }

    public List<CustomerDto> getCustomer() {
        return customer;
    }
}
