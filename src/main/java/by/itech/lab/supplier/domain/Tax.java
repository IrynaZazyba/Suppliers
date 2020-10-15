package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "tax")
public class Tax {
    private Long id;
    private Long amount;
    private Long percentage;
    private String name;
    private Zone zone;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "amount")
    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    @Column(name = "percentage")
    public Long getPercentage() {
        return percentage;
    }

    public void setPercentage(Long percentage) {
        this.percentage = percentage;
    }

    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @ManyToOne
    @JoinColumn(name = "zone_id")
    public Zone getZone() {
        return zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tax)) return false;
        Tax tax = (Tax) o;
        return Objects.equals(getId(), tax.getId()) &&
                Objects.equals(getAmount(), tax.getAmount()) &&
                Objects.equals(getPercentage(), tax.getPercentage()) &&
                Objects.equals(getName(), tax.getName()) &&
                Objects.equals(getZone(), tax.getZone());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getAmount(), getPercentage(), getName(), getZone());
    }

    @Override
    public String toString() {
        return "Tax{" +
                "id=" + id +
                ", amount=" + amount +
                ", percentage=" + percentage +
                ", name='" + name + '\'' +
                ", zone=" + zone +
                '}';
    }
}
