package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
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
@Table(name = "`user`")
public class User implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String surname;

    private LocalDate birthday;

    private String username;

    private String password;

    private String email;

    private String activationKey;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @OneToMany(mappedBy = "createdByUsers")
    private Set<WayBill> creatorWayBills = new HashSet<>();

    @OneToMany(mappedBy = "updatedByUsers")
    private Set<WayBill> updatorWayBills = new HashSet<>();

    @OneToMany(mappedBy = "driver")
    private Set<WayBill> driverWayBills = new HashSet<>();

    @OneToMany(mappedBy = "createdByUsers")
    private Set<Application> creatorApplications = new HashSet<>();

    @OneToMany(mappedBy = "lastUpdatedByUsers")
    private Set<Application> updatorApplications = new HashSet<>();
    private boolean active;
}
