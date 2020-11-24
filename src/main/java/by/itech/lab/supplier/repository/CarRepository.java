package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Modifying
    @Query("update Car set deletedAt = current_timestamp where id = :id")
    void deleteById(@Param("id") Long id);

    @Modifying
    @Query("update Car set currentCapacity = currentCapacity + :capacity  where id = :id")
    int changeCurrentCapacity (@Param("capacity") double capacity, @Param("id") Long id);


}
