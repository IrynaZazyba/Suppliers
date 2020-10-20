package by.itech.lab.supplier.auth.service;

import by.itech.lab.supplier.auth.UserImpl;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service("userDetailsService")
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

    private UserRepository userRepository;

    public CustomUserDetailsServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsernameAndCustomerName(String username, String customerName) throws UsernameNotFoundException {
        if (StringUtils.isAnyBlank(username, customerName)) {
            throw new UsernameNotFoundException("Username and name must be provided");
        }

        User user = userRepository.findByUsernameAndCustomer(username, customerName);
        UserImpl userImpl;
        if (user == null) {
            throw new UsernameNotFoundException(
                    String.format("Username not found for name, username=%s, customerName=%s",
                            username, customerName));
        } else {
            final List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(user.getRole().getAuthority()));
            userImpl = new UserImpl(user.getUsername(), user.getCustomer().getName(),
                    user.getPassword(), true,
                    true, true, user.isActive(), authorities);
        }
        return userImpl;
    }
}
