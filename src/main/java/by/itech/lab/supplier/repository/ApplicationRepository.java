package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

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


    @Query("select app from Application app where (:flag = true or (:flag = false and app.wayBill is null)) " +
            "and (:status is null or app.applicationStatus=:status) " +
            "and (:warehouseId is null or (app.sourceLocationAddress.id=:warehouseId or app.destinationLocationAddress.id=:warehouseId))")
    Page<Application> findAllByRoleAndStatusAndWarehouse(Pageable pageable,
                                                         @Param("flag") Boolean roleFlag,
                                                         @Param("status") ApplicationStatus status,
                                                         @Param("warehouseId") Long warehouseId);
}
