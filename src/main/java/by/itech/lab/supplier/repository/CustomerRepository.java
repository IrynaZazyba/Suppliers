package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findAll(Pageable pageable);

    Page<Customer> findAllByStatus(Pageable pageable, String status);

}
