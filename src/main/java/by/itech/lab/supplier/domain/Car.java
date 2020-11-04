package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import javax.persistence.*;
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
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private Long number;
    @Column(nullable = false)
    private Double totalCapacity;
    @Column(nullable = false)
    private Double currentCapacity;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
    @OneToMany(mappedBy = "car")
    private Set<WayBill> wayBills = new HashSet<>();
    private LocalDate deletedAt;

}
