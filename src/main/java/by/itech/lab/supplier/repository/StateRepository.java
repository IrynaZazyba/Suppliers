package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository  extends JpaRepository<State, Long> {

    Page<State> findAll(Pageable pageable);
}
