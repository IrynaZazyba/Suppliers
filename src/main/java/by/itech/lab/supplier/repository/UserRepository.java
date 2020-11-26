package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    @Query("select c from User c where :active is null or c.active=:active")
    Page<User> findByStatus(Pageable pageable, @Param("active") Boolean active);

    @Modifying
    @Query("update User set deletedAt = current_timestamp where id = :id")
    void delete(@Param("id") Long id);

    @Modifying
    @Query("update User set active = :active where id = :id")
    int setStatus(@Param("active") Boolean active, @Param("id") Long id);

    @Modifying
    @Query("update User set password = :password where id = :id")
    int changePassword(@Param("password") String password, @Param("id") Long id);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneWithRolesById(Long id);

    Page<User> findAll(Pageable pageable);

    Page<User> findAllByActiveEquals(Pageable pageable, Boolean active);

    @Modifying
    @Query("update User set warehouse = :warehouse where id in :usersId")
    void setWarehouseIntoUser(Warehouse warehouse, List<Long> usersId);

    @Query("select u from User u where u.customer.id = :customerId " +
            "and u.role = :role and u.active=true")
    Page<User> getAllDispatchers(Long customerId, Pageable pageable, Role role);
}
