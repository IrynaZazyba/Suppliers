package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
@FilterDef(name = "accessFilter", parameters = @ParamDef(name = "companyId", type = "long"))
@Filter(name = "accessFilter", condition = "customer_id = :companyId")
public class Warehouse implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String identifier;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WarehouseType type;
    @Column(nullable = false)
    private Double totalCapacity;
    private LocalDate deletedAt;
    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    private Long retailerId;
    @OneToMany(mappedBy = "warehouse")
    @EqualsAndHashCode.Exclude
    private Set<User> users = new HashSet<>();
}
