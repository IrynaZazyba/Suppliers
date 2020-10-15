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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Car)) return false;
        Car car = (Car) o;
        return Objects.equals(getId(), car.getId()) &&
                Objects.equals(getNumber(), car.getNumber()) &&
                Objects.equals(getTotalCapacity(), car.getTotalCapacity()) &&
                Objects.equals(getCurrentCapacity(), car.getCurrentCapacity()) &&
                Objects.equals(getCustomer(), car.getCustomer()) &&
                Objects.equals(getAddress(), car.getAddress()) &&
                Objects.equals(getWayBills(), car.getWayBills());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getNumber(), getTotalCapacity(), getCurrentCapacity(), getCustomer(), getAddress(), getWayBills());
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
