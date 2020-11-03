package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
@Where(clause="deleted_at is null")
public class Application implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String number;
    @Column(nullable = false)
    private Date registrationDate;
    @Column(nullable = false)
    private Date lastUpdated;
    @ManyToOne
    @JoinColumn(name = "source_location_address_id")
    private Address sourceLocationAddressId;
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
    private boolean deleted;
    private Date deletedAt;
    @ManyToMany(cascade = {
      CascadeType.PERSIST,
      CascadeType.MERGE
    })
    @JoinTable(name = "items_in_application",
      joinColumns = @JoinColumn(name = "application_id"),
      inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private Set<Item> items = new HashSet<>();

}
