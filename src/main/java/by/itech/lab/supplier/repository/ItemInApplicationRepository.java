package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.ItemsInApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ItemInApplicationRepository extends JpaRepository<ItemsInApplication, Long> {

    Set<ItemsInApplication> findByApplicationIdAndIdIn(Long applicationId, List<Long> id);

    @Query("select count(i) from ItemsInApplication i where i.application.id=:appId and i.acceptedAt is null")
    int getCountUnsatisfiedItems(@Param("appId") Long appId);

}
