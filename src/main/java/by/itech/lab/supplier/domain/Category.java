package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "category")
public class Category implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String category;
    @Column(nullable = false)
    private Double taxRate;
    @OneToMany(mappedBy = "category", fetch = FetchType.EAGER)
    private Set<Item> items = new HashSet<>();
    @Column(name = "is_active")
    private boolean active;

}