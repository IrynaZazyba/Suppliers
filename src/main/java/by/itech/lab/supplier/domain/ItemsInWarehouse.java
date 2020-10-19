package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "items_in_warehouse")
public class ItemsInWarehouse {

    private Long id;

    //todo it is necessary to check the relationship between entities,
    // should be considered in SUP-10

//    private Double amount;
//    private Warehouse warehouse;
//    private Item item;
//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
//
//    @Column(name = "amount", nullable = false)
//    public Double getAmount() {
//        return amount;
//    }
//
//    public void setAmount(Double amount) {
//        this.amount = amount;
//    }


}
