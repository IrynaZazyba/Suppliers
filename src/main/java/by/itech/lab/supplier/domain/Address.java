package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

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
    private String addressLine1;
    private String addressLine2;
    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zone zone;
    @OneToMany(mappedBy = "address")
    private Set<Car> cars = new HashSet<>();
    @OneToMany(mappedBy = "sourceLocationAddress")
    private Set<WayBill> wayBills = new HashSet<>();
    @OneToMany(mappedBy = "destinationLocationAddress")
    private Set<Application> applications = new HashSet<>();

}
