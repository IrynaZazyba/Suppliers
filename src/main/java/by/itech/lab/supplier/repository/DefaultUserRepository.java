package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DefaultUserRepository extends JpaRepository<User,Long> {

    User findByUsername(String username);
}
