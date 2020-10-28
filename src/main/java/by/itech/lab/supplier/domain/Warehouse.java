package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table()
public class Warehouse implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String identifier;
    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private Double totalCapacity;
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @OneToMany(mappedBy = "warehouse")
    private Set<User> users = new HashSet<>();
}
