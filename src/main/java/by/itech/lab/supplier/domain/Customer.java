package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table()
public class Customer implements BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private LocalDate registrationDate;
    @Column(nullable = false)
    private boolean status;
    @OneToMany(mappedBy = "customer")
    private Set<Warehouse> warehouses = new HashSet<>();
    @OneToMany(mappedBy = "customer")
    private Set<User> users = new HashSet<>();

}
