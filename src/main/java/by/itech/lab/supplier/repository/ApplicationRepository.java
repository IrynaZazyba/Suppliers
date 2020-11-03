package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("select app from Application app where app.number = :number")
    Optional<Application> findByNumber(@Param("number") final String number);

    @Query("select app from Application app")
    Page<Application> findAllNotDeleted(Pageable pageable);

    @Query("select app from Application app where app.createdByUsers.id =:user_id")
    Page<Application> findAllByCreatedByUsers(Pageable pageable, @Param("user_id") Long userId);

    @Query("select app from Application app where app.sourceLocationAddressId.id =:address_id")
    Page<Application> findAllByLocationAddressId(Pageable pageable, @Param("address_id") Long addressId);

    @Query("select app from Application app where app.applicationStatus =:status")
    Page<Application> findAllByApplicationStatus(Pageable pageable, @Param("status") String status);

    @Query("select app from Application app where app.wayBill.id =:waybill_id")
    Page<Application> findAllByWayBill(Pageable pageable, @Param("waybill_id") Long waybillId);

    @Modifying
    @Query("update Application set applicationStatus = :status where id = :id")
    void changeStatus(@Param("id") Long id, @Param("status") String status);

    @Modifying
    @Query("update Application set deleted = true, deletedAt = :deletedTime where id = :id")
    void deleteById(@Param("id") Long id, @Param("deletedTime")LocalDate deletedTime);

}
