package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.WayBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaybillRepository extends JpaRepository<WayBill, Long> {

}
