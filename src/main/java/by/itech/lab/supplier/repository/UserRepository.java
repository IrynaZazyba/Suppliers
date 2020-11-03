package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);

    @Modifying
    @Query("update User set deletedAt = :deletedDate where id = :id")
    void delete(@Param("id") Long id, @Param("deletedDate")LocalDate deletedDate);

    @Modifying
    @Query("update User set active = :isActive where id = :id")
    boolean setStatus( @Param("isActive") boolean isActive, @Param("id") Long id);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneWithRolesById(Long id);

    Page<User> findAll(Pageable pageable);

    Page<User> findAllByActiveEquals(Pageable pageable, Boolean active);

}
