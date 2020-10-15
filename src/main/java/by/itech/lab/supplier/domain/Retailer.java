package by.itech.lab.supplier.domain;

import javax.persistence.*;

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
}
