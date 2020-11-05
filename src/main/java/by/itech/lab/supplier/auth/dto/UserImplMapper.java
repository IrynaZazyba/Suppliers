package by.itech.lab.supplier.auth.dto;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class UserImplMapper {

    public UserImplDto map(UserImpl entity) {
        GrantedAuthority role = entity.getAuthorities()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No role"));
        return UserImplDto.builder().id(entity.getId())
                .username(entity.getUsername())
                .customer(entity.getCustomer())
                .role(role.getAuthority())
                .build();
    }
}
