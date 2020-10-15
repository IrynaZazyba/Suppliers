package by.itech.lab.supplier.domain;


import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "item")
public class Item {
    private Long id;
    private Long upc;
    private String label;
    private Long units;
    private Category category;
    private Set<TaxPerDistance> taxPerDistances = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "upc", nullable = false)
    public Long getUpc() {
        return upc;
    }

    public void setUpc(Long upc) {
        this.upc = upc;
    }

    @Column(name = "label", nullable = false)
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    @Column(name = "units", nullable = false)
    public Long getUnits() {
        return units;
    }

    public void setUnits(Long units) {
        this.units = units;
    }

    @ManyToOne
    @JoinColumn(name = "category_id")
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @OneToMany(mappedBy = "item")
    public Set<TaxPerDistance> getTaxPerDistances() {
        return taxPerDistances;
    }

    public void setTaxPerDistances(Set<TaxPerDistance> taxPerDistances) {
        this.taxPerDistances = taxPerDistances;
    }

}
