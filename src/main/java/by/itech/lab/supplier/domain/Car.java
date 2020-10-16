package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "car")
public class Car {

    private Long id;
    private Long number;
    private Long totalCapacity;
    private Long currentCapacity;
    private Customer customer;
    private Address address;
    private Set<WayBill> wayBills = new HashSet<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "number", nullable = false)
    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    @Column(name = "total_capacity", nullable = false)
    public Long getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Long totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    @Column(name = "current_capacity", nullable = false)
    public Long getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(Long currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    @ManyToOne
    @JoinColumn(name = "customer_id")
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @ManyToOne
    @JoinColumn(name = "address_id")
    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @OneToMany(mappedBy = "car")
    public Set<WayBill> getWayBills() {
        return wayBills;
    }

    public void setWayBills(Set<WayBill> wayBills) {
        this.wayBills = wayBills;
    }


    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", number=" + number +
                ", totalCapacity=" + totalCapacity +
                ", currentCapacity=" + currentCapacity +
                ", customer=" + customer +
                ", address=" + address +
                ", wayBills=" + wayBills +
                '}';
    }
}
