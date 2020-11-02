package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.mail.MailService;
import by.itech.lab.supplier.service.mail.MailServiceImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final MailServiceImpl mailService;

    @Override
    public Optional<UserDto> findById(Long id) {
        return userRepository.findOneWithRolesById(id).map(userMapper::map);
    }

    public Page<UserDto> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::map);
    }

    public Page<UserDto> getAllActive(Pageable pageable) {
        return userRepository.findAllByActiveEquals(pageable, true).map(userMapper::map);
    }

    public UserDto save(UserDto userDTO) {
        User user = Optional.ofNullable(userDTO.getId())
                .map(item -> {
                    final User existing = userRepository
                            .findById(userDTO.getId())
                            .orElseThrow();
                    userMapper.update(userDTO, existing);
                    return existing;
                })
                .orElseGet(() -> {
                    MailService mailService1 = new MailServiceImpl();
                    mailService1.sendMail(userDTO);
                   return userMapper.map(userDTO);
                });

        final User saved = userRepository.save(user);
        return userMapper.map(saved);
    }

    @Override
    @Transactional
    public boolean changeActiveStatus(String username, boolean status) {
        return userRepository.setStatus(status, username);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

}
