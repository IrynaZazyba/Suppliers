package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "retailer")
public class Retailer {

    private Long id;
    private String fullName;
    private String identifier;
    private String retailersCol;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "fullname", nullable = false)
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @Column(name = "identifier", nullable = false)
    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    @Column(name = "retailerscol", nullable = false)
    public String getRetailersCol() {
        return retailersCol;
    }

    public void setRetailersCol(String reailersCol) {
        this.retailersCol = reailersCol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Retailer)) return false;
        Retailer retailer = (Retailer) o;
        return Objects.equals(getId(), retailer.getId()) &&
                Objects.equals(getFullName(), retailer.getFullName()) &&
                Objects.equals(getIdentifier(), retailer.getIdentifier()) &&
                Objects.equals(getRetailersCol(), retailer.getRetailersCol());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getFullName(), getIdentifier(), getRetailersCol());
    }

    @Override
    public String toString() {
        return "Retailer{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", identifier='" + identifier + '\'' +
                ", retailersCol='" + retailersCol + '\'' +
                '}';
    }
}
