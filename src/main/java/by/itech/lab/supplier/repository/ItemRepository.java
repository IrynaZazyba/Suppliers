package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
