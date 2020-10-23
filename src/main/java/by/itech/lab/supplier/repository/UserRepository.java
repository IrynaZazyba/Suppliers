package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;



@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findBy();

    Optional<User> findById(Long id);

    void deleteById(Long id);

    Optional<User> findOneByActivationKey(String activationKey);

    @Modifying
    @Query("update `user` u set u.active = ?1 where u.id = ?2")
    boolean setStatus(boolean isActive, Long id);

    Optional<User> findOneByEmailIgnoreCase(String email);

    boolean existsByUsername(String username);

    boolean existsByUsernameIsAndIdNot(String username, Long id);

    boolean existsByEmail(String email);

    boolean existsByEmailIsAndIdNot(String email, Long id);

    Optional<User> findOneById(Long id);

    Optional<User> findOneWithRolesById(Long id);

    Optional<User> findOneWithRolesByUsername(String login);

    Optional<User> findOneWithRolesByEmail(String email);

    Page<User> findAllByUsernameNot(Pageable pageable, String login);
}