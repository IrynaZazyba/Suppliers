package by.itech.lab.supplier.repository.filter;

import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.domain.Item_;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.domain.WarehouseItem;
import by.itech.lab.supplier.domain.WarehouseItem_;
import by.itech.lab.supplier.domain.Warehouse_;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.ItemDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WarehouseItemFilter {

    public Specification<WarehouseItem> buildSearchSpecification(final List<ApplicationDto> apps) {
        return (root, cq, cb) -> {
            Join<WarehouseItem, Warehouse> whJoin = root.join(WarehouseItem_.warehouse);
            Join<WarehouseItem, Item> itemJoin = root.join(WarehouseItem_.item);
            return cb.or(apps.stream().map(app -> {
                Long whId = app.getDestinationLocationDto().getId();
                // getting all related items
                List<Long> itemIds = app.getItems().stream()
                        .map(ApplicationItemDto::getItemDto).map(ItemDto::getId).collect(Collectors.toList());
                return cb.and(cb.equal(whJoin.get(Warehouse_.id), whId),
                        itemJoin.get(Item_.id).in(itemIds)
                );
            }).toArray(Predicate[]::new));
        };
    }

}
