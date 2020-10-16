package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "zone")
public class Zone {
    private Long id;
    private String zone;
    private Set<Tax> taxes = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "zone", nullable = false)
    public String getZone() {
        return zone;
    }

    public void setZone(String category) {
        this.zone = category;
    }

    @OneToMany(mappedBy = "zone")
    public Set<Tax> getTaxes() {
        return taxes;
    }

    public void setTaxes(Set<Tax> taxes) {
        this.taxes = taxes;
    }



    @Override
    public String toString() {
        return "Zone{" +
                "id=" + id +
                ", zone='" + zone + '\'' +
                ", taxes=" + taxes +
                '}';
    }
}
