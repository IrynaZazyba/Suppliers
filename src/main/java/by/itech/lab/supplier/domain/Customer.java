package by.itech.lab.supplier.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
public class Customer implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private LocalDate registrationDate;
    @Column(nullable = false)
    private boolean active;
    private LocalDate deletedAt;
    @OneToMany(mappedBy = "customer")
    @EqualsAndHashCode.Exclude
    private Set<Warehouse> warehouses = new HashSet<>();
    @OneToMany(mappedBy = "customer")
    @EqualsAndHashCode.Exclude
    private Set<User> users = new HashSet<>();
}
