package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.UsState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsStateRepository extends JpaRepository<UsState, Long> {

    List<UsState> findByStateStartingWith(final String state);

    Page<UsState> findAll(Pageable pageable);
}
