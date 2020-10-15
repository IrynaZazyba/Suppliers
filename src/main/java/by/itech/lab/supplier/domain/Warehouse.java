package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "public.warehouse")
public class Warehouse {

    private int id;
    private String identifier;
    private String type;
    private Long totalCapacity;
    private Address address;
    private Customer customer;
    private Set<User> users = new HashSet<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "identifier", nullable = false)
    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    @Column(name = "type", nullable = false)
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Column(name = "total_capacity", nullable = false)
    public Long getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Long totalCapacity) {
        this.totalCapacity = totalCapacity;
    }


    @ManyToOne
    @JoinColumn(name = "address_id")
    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @ManyToOne
    @JoinColumn(name = "customer_id")
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @OneToMany(mappedBy = "warehouse")
    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Warehouse)) return false;
        Warehouse warehouse = (Warehouse) o;
        return getId() == warehouse.getId() &&
                Objects.equals(getIdentifier(), warehouse.getIdentifier()) &&
                Objects.equals(getType(), warehouse.getType()) &&
                Objects.equals(getTotalCapacity(), warehouse.getTotalCapacity()) &&
                Objects.equals(getAddress(), warehouse.getAddress()) &&
                Objects.equals(getCustomer(), warehouse.getCustomer()) &&
                Objects.equals(getUsers(), warehouse.getUsers());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getIdentifier(), getType(), getTotalCapacity(), getAddress(), getCustomer(), getUsers());
    }

    @Override
    public String toString() {
        return "Warehouse{" +
                "id=" + id +
                ", identifier='" + identifier + '\'' +
                ", type='" + type + '\'' +
                ", totalCapacity=" + totalCapacity +
                ", address=" + address +
                ", customer=" + customer +
                ", users=" + users +
                '}';
    }
}
