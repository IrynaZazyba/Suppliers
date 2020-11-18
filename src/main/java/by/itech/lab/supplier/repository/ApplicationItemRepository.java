package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.ApplicationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ApplicationItemRepository extends JpaRepository<ApplicationItem, Long> {

    Set<ApplicationItem> findByApplicationIdAndIdIn(Long applicationId, List<Long> id);

    @Query("select count(i) from ApplicationItem i where i.application.id=:appId and i.acceptedAt is null")
    int getUnsatisfiedItemsCount(@Param("appId") Long appId);

    @Modifying
    @Query("update ApplicationItem i set i.acceptedAt= current_timestamp where i.id in (:appsId)")
    int setAcceptedAtForItemsInApplication(@Param("appsId") List<Long> appsId);

}
