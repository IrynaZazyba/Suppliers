package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

//    @Query("select c from Customer c where :active is null or c.status=:active")
//    Page<Customer> findByStatus(Pageable pageable, @Param("active") Boolean active);

    Page<Warehouse> findAll(Pageable pageable);

//    @Modifying
//    @Query("update User set activeForDeletion = false where id = :id")
//    void deleteById(@Param("id") Long id);
//
//    @Modifying
//    @Query("update User set active = :isActive where id = :id")
//    boolean setStatus( @Param("isActive") boolean isActive, @Param("id") Long id);


//    Optional<Item> findByLabel(final String label);
//
//    Page<Item> findAllByCategory(final CategoryDto categoryDto, final Pageable page);
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
}
