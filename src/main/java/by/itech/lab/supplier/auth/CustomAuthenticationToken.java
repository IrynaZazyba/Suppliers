package by.itech.lab.supplier.auth;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private static final long serialVersionUID = 5173151742024022760L;
    private String name;

    public CustomAuthenticationToken(Object principal, Object credentials, String name) {
        super(principal, credentials);
        this.name = name;
        super.setAuthenticated(false);
    }

    public CustomAuthenticationToken(Object principal, Object credentials, String name,
                                     Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
        this.name = name;
        super.setAuthenticated(true);
    }

    public String getName() {
        return this.name;
    }
}
