package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("select c from Customer c where :active is null or c.status=:active")
    Page<Customer> findByStatus(Pageable pageable, @Param("active") Boolean active);

    @Modifying
    @Query("update Customer set status = false where id = :id")
    void delete(@Param("id") Long id);

    @Modifying
    @Query("update Customer set status = true where id = :id")
    void activate(@Param("id") Long id);

}
