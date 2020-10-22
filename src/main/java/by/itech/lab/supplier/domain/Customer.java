package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "customer")
public class Customer implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "registration_date", nullable = false)
    private Date registrationDate;
    @Column(name = "status", nullable = false)
    private String status;
    @OneToMany(mappedBy = "customer")
    private Set<Warehouse> warehouses = new HashSet<>();
    @OneToMany(mappedBy = "customer")
    private Set<User> users = new HashSet<>();

}
