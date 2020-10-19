package by.itech.lab.supplier.repository;
import by.itech.lab.supplier.domain.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.time.Instant;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findOneByActivationKey(String activationKey);

  //  List<User> findAllByStatusIsFalseAndCreatedDateBefore(Instant dateTime);

  Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByUsername(String login);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findOneWithRolesById(Long id);

    @EntityGraph(attributePaths = "roles")

    Optional<User> findOneWithRolesByUsername(String login);

    @EntityGraph(attributePaths = "roles")

    Optional<User> findOneWithRolesByEmail(String email);

    Page<User> findAllByUsernameNot(Pageable pageable, String login);
}