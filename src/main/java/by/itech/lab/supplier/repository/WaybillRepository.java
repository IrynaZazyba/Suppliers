package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.domain.WaybillStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WaybillRepository extends JpaRepository<WayBill, Long> {

    @Query("select w from WayBill w where (:status is null or w.waybillStatus=:status) " +
            "and ((:role like 'ROLE_LOGISTICS_SPECIALIST' and w.createdByUsers.id=:userId) " +
            "or (:role like 'ROLE_DRIVER' and w.waybillStatus='READY'))")
    Page<WayBill> findAllByRoleAndStatus(Pageable pageable,
                                         WaybillStatus status,
                                         Long userId,
                                         @Param("role") String userRole);


}
