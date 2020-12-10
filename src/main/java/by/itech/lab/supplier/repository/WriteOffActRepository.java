package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.WriteOffAct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface WriteOffActRepository extends JpaRepository<WriteOffAct, Long> {

    Page<WriteOffAct> findAllByOrderByDateDesc(Pageable pageable);

    Page<WriteOffAct> findAllByCreatorIdOrderByDateDesc(Long creatorId, Pageable pageable);

    Page<WriteOffAct> findAllByWarehouseIdOrderByDateDesc(Long warehouseId, Pageable pageable);

    @Modifying
    @Query("update WriteOffAct set deletedAt = :deletedTime where id = :id")
    void deleteById(@Param("id") Long id, @Param("deletedTime") LocalDate deletedTime);
}
