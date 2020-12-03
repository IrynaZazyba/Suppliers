package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.WriteOffActReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WriteOffReasonRepository extends JpaRepository<WriteOffActReason, Long> {

    List<WriteOffActReason> findByReasonStartingWith(final String reasonName);

}
