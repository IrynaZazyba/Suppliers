package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "tax_per_distance")
public class TaxPerDistance {

    private Long id;
    private Long taxRate;
    private Item item;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "tax_rate")
    public Long getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(Long taxRate) {
        this.taxRate = taxRate;
    }

    @ManyToOne
    @JoinColumn(name = "item_id")
    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TaxPerDistance)) return false;
        TaxPerDistance that = (TaxPerDistance) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getTaxRate(), that.getTaxRate()) &&
                Objects.equals(getItem(), that.getItem());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTaxRate(), getItem());
    }

    @Override
    public String toString() {
        return "TaxPerDistance{" +
                "id=" + id +
                ", taxRate=" + taxRate +
                ", item=" + item +
                '}';
    }
}
