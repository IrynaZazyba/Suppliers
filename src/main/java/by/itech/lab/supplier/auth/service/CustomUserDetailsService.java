package by.itech.lab.supplier.auth.service;

import by.itech.lab.supplier.auth.UserImpl;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        UserImpl userImpl;
        if (user == null) {
            throw new UsernameNotFoundException(String.format("Username not found for email=%s", email));
        } else {
            List<CustomerDto> customers = new ArrayList<>();
            customers.add(CustomerDto.toDto(user.getCustomer()));
            userImpl = new UserImpl(user.getUsername(), user.getPassword(), customers, true,
                    true, true, user.isActive(), defineAuthority(user));
        }
        return userImpl;
    }

    private List<GrantedAuthority> defineAuthority(User user) {
        final List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().getAuthority()));
        return authorities;
    }
}
