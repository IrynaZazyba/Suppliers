package by.itech.lab.supplier.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
@Where(clause = "deleted_at is null")
@FilterDef(name = "accessFilter", parameters = @ParamDef(name = "companyId", type = "long"))
@Filter(name = "accessFilter", condition = "customer_id = :companyId")
public class Item implements BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private BigDecimal upc;
    @Column(nullable = false)
    private String label;
    @Column(nullable = false)
    private Double units;
    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;
    private LocalDate deletedAt;
    private Long customerId;

}
