package by.itech.lab.supplier.auth.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface CustomUserDetailsService {

    UserDetails loadUserByUsernameAndCustomerName(String username, String customerName)
            throws UsernameNotFoundException;

}
