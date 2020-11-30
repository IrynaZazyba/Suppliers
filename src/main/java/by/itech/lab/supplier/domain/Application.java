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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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
@Where(clause = "deleted_at is null")
@FilterDef(name = "accessFilter", parameters = @ParamDef(name = "companyId", type = "long"))
@Filter(name = "accessFilter", condition = "customer_id = :companyId")
public class Application implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String number;
    @Column(nullable = false)
    private LocalDate registrationDate;
    @Column(nullable = false)
    private LocalDate lastUpdated;
    @ManyToOne
    @JoinColumn(name = "source_location_warehouse_id")
    private Warehouse sourceLocationAddress;
    @ManyToOne
    @JoinColumn(name = "destination_location_warehouse_id")
    private Warehouse destinationLocationAddress;
    @ManyToOne
    @JoinColumn(name = "created_by_users_id")
    private User createdByUsers;
    @ManyToOne
    @JoinColumn(name = "last_updated_by_users_id")
    private User lastUpdatedByUsers;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;
    @ManyToOne
    @JoinColumn(name = "waybill_id")
    private WayBill wayBill;
    private LocalDate deletedAt;
    @OneToMany(mappedBy = "application", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    private Set<ApplicationItem> items = new HashSet<>();
    private Long customerId;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplicationType type;

}
