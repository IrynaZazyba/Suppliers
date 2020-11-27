package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


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
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "state_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private State state;
    private Double latitude;
    private Double longitude;

}
