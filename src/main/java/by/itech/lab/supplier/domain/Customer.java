package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "customer")
public class Customer implements Serializable {
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
