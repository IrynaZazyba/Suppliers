package by.itech.lab.supplier.auth;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class UserImpl extends org.springframework.security.core.userdetails.User {

    private static final long serialVersionUID = 2403758130184537815L;
    private Long id;
    private List<CustomerDto> customer;

    public UserImpl(Long id, String username, String password, List<CustomerDto> customer,
                    boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, true, true, true, accountNonLocked, authorities);
        this.customer = customer;
        this.id = id;
    }

    public List<CustomerDto> getCustomer() {
        return customer;
    }

    public boolean atCustomer(final Long customerId) {
        return customer.stream().anyMatch(customer -> Objects.equals(customer.getId(), customerId));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
