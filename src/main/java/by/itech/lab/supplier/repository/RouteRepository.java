package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RouteRepository extends JpaRepository<Route, Long> {

    @Modifying
    @Query("update WayPoint set isVisited=true where id=:id")
    void makeWayPointVisited(Long id);

}
