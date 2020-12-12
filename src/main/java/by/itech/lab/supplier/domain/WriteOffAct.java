package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.Where;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
@Where(clause = "deleted_at is null")
@FilterDef(name = "accessFilter", parameters = @ParamDef(name = "companyId", type = "long"))
@Filter(name = "accessFilter", condition = "customer_id = :companyId")
public class WriteOffAct implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String identifier;
    @Column(nullable = false)
    private BigDecimal totalSum;
    @Column(nullable = false)
    private BigDecimal totalAmount;
    @Column(nullable = false)
    private LocalDate date;
    private LocalDate deletedAt;
    @Column(nullable = false)
    private Long customerId;
    @OneToMany(mappedBy = "writeOffAct", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @EqualsAndHashCode.Exclude
    private Set<WriteOffItem> items = new HashSet<>();
    @Column(nullable = false)
    private Long creatorId;
    private Long warehouseId;

}
