package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
@Where(clause = "deleted_at is null")
public class Retailer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String fullName;
    @Column(nullable = false, unique = true)
    private String identifier;
    @Column(nullable = false)
    private String retailersCol;
    private LocalDate deletedAt;
    private boolean active;

}
