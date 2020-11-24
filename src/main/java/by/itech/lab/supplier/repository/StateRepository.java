package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateRepository extends JpaRepository<State, Long> {

    List<State> findByStateStartingWith(final String state);
}
