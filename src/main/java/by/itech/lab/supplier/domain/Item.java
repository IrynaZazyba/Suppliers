package by.itech.lab.supplier.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
@Where(clause = "deleted_at is null")
public class Item implements BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private BigDecimal upc;
    @Column(nullable = false)
    private String label;
    @Column(nullable = false)
    private Double units;
    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;
    private LocalDate deletedAt;

}
