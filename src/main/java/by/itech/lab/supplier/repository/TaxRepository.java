package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Tax;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaxRepository extends JpaRepository<Tax, Long> {

    Optional<Tax> findByStateId(Long stateId);

}
