package by.itech.lab.supplier.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table
public class Address implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false, name = "address_line_1")
    private String addressLine1;
    @Column(nullable = false, name = "address_line_2")
    private String addressLine2;
    @ManyToOne(cascade= CascadeType.ALL)
    @JoinColumn(name = "state_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private State state;

}
