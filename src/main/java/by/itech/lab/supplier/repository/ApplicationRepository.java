package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationItem;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.ApplicationType;
import by.itech.lab.supplier.domain.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("select app from Application app where app.number = :number")
    Optional<Application> findByNumber(@Param("number") final String number);


    @Query("select app from Application app where :status is null or app.applicationStatus=:status")
    Page<Application> findAllByStatus(Pageable pageable,
                                      @Param("status") ApplicationStatus status);

    @Query("select app from Application app where :flag = true or (:flag = false and app.type like 'TRAFFIC')")
    Page<Application> findAllByUserRole(Pageable pageable,
                                        @Param("flag") Boolean roleFlag);

    @Modifying
    @Query("update Application set applicationStatus = :status where id = :id")
    void changeStatus(@Param("id") Long id, @Param("status") ApplicationStatus status);

    @Modifying
    @Query("update Application set deletedAt = :deletedTime where id = :id")
    void deleteById(@Param("id") Long id, @Param("deletedTime") LocalDate deletedTime);


    @Query("select app from Application app where (:flag = true or app.type='TRAFFIC') " +
            "and (:status is null or app.applicationStatus=:status) " +
            "and (:warehouseId is null or (app.sourceLocationAddress.id=:warehouseId or app.destinationLocationAddress.id=:warehouseId))")
    Page<Application> findAllByRoleAndStatusAndWarehouse(Pageable pageable,
                                                         @Param("flag") Boolean roleFlag,
                                                         @Param("status") ApplicationStatus status,
                                                         @Param("warehouseId") Long warehouseId);

    List<Application> findAllByWayBillIdIn(List<Long> waybillsIds);

    List<Application> findAllByIdIn(List<Long> ids);

    @Query("select distinct a.sourceLocationAddress from Application a where a.applicationStatus='OPEN' " +
            "and a.sourceLocationAddress.type='WAREHOUSE' and a.wayBill is null")
    List<Warehouse> getWarehousesWithOpenApplications();

    @Query("select app from Application app where (app.applicationStatus='OPEN' " +
            "or app.applicationStatus='STARTED_PROCESSING') " +
            "and app.sourceLocationAddress.id=:warehouseId and app.type=:type and (app.wayBill is null or " +
            "(:waybillId is not null and app.wayBill.id=:waybillId))")
    Page<Application> findAllByTypeAndApplicationStatusAndSourceLocationAddressId(Pageable pageable,
                                                                                  ApplicationType type,
                                                                                  Long warehouseId,
                                                                                  Long waybillId);

    @Query("select app.id from Application app where app.sourceLocationAddress in :id or app.destinationLocationAddress in :id")
    List<Long> findIdsByFinishedStatus(@Param("id") List<Long> id);

}
