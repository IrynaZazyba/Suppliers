package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Tax;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxRepository extends JpaRepository<Tax, Long> {

    Tax findByStateId(Long stateId);

}
