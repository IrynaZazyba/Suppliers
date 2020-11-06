package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

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
public class Application implements BaseEntity {

    @OneToMany(mappedBy = "application")
    @EqualsAndHashCode.Exclude
    Set<ItemsInApplication> items = new HashSet<>();
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
    @JoinColumn(name = "source_location_address_id")
    private Address sourceLocationAddressId;
    @ManyToOne
    @JoinColumn(name = "destination_location_address_id")
    private Address destinationLocationAddressId;
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

}
