package by.itech.lab.supplier.auth;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;

    public CustomUserDetailsService(UserRepository userRepository, CustomerMapper customerMapper) {
        this.userRepository = userRepository;
        this.customerMapper = customerMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserImpl userImpl;
        User user = userRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(String.format("Username not found for email=%s", email)));
        List<CustomerDto> customers = Collections.singletonList(customerMapper.map(user.getCustomer()));
        userImpl = new UserImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                customers,
                user.isActive(),
                defineAuthority(user)
        );
        return userImpl;
    }

    private List<GrantedAuthority> defineAuthority(User user) {
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getAuthority()));
    }
}
