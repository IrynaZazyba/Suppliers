package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

//    Optional<Item> findByNumber(final String number);
//
//    @Query("select i from Item i where :active is null or i.active=:active")
//    Page<Item> findAllByActive(Pageable pageable, @Param("active") Boolean active);
//
//    @Modifying
//    @Query("update Item set active = false where id = :id")
//    void delete(@Param("id") Long id);
//
//    @Modifying
//    @Query("update Item set active = true where id = :id")
//    void activate(@Param("id") Long id);
//    

}
