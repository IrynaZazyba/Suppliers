package by.itech.lab.supplier.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String state;
    private String city;
    @Column(name = "address_line_1")
    private String addressLine1;
    @Column(name = "address_line_2")
    private String addressLine2;
    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zone zone;
    @OneToMany(mappedBy = "address")
    private Set<Warehouse> warehouses = new HashSet<>();
    @OneToMany(mappedBy = "address")
    private Set<Car> cars = new HashSet<>();
    @OneToMany(mappedBy = "sourceLocationAddress")
    private Set<WayBill> wayBills = new HashSet<>();
    @OneToMany(mappedBy = "destinationLocationAddress")
    private Set<Application> applications = new HashSet<>();

}
