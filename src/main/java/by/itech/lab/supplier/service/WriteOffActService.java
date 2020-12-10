package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.WriteOffActDto;
import by.itech.lab.supplier.dto.WriteOffActReasonDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WriteOffActService extends BaseSimpleService<WriteOffActDto> {

    List<WriteOffActReasonDto> findReasons(String reasonName);

    Page<WriteOffActDto> findAllByCreatorId(Long creatorId, Pageable pageable);

    Page<WriteOffActDto> findAllByWarehouseId(Long warehouseId, Pageable pageable);

}
