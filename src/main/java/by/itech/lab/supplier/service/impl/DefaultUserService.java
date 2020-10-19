package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.repository.DefaultUserRepository;
import by.itech.lab.supplier.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DefaultUserService implements UserService, UserDetailsService {

    private final DefaultUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        return userRepository.findByUsername(s);
    }

}
