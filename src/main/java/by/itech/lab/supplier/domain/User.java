package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "user")
public class User {

    private Long id;
    private String name;
    private String surname;
    private Date birthday;
    private String username;
    private String password;
    private String email;
    private String activationKey;
    private Role role;
    private Address address;
    private Customer customer;
    private Warehouse warehouse;
    private Set<WayBill> creatorWayBills = new HashSet<>();
    private Set<WayBill> updatorWayBills = new HashSet<>();
    private Set<WayBill> driverWayBills = new HashSet<>();
    private Set<Application> creatorApplications = new HashSet<>();
    private Set<Application> updatorApplications = new HashSet<>();
    private boolean active;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "name", nullable = false)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "surname", nullable = false)
    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    @Column(name = "birthday")
    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    @Column(name = "username", nullable = false, unique = true)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Column(name = "password", nullable = false)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "email", nullable = false, unique = true)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Column(name = "activation_key", nullable = false)
    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
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

    @ManyToOne
    @JoinColumn(name = "warehouse_id")
    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    @OneToMany(mappedBy = "createdByUsers")
    public Set<WayBill> getCreatorWayBills() {
        return creatorWayBills;
    }

    public void setCreatorWayBills(Set<WayBill> creatorWayBills) {
        this.creatorWayBills = creatorWayBills;
    }

    @OneToMany(mappedBy = "updatedByUsers")
    public Set<WayBill> getUpdatorWayBills() {
        return updatorWayBills;
    }

    public void setUpdatorWayBills(Set<WayBill> updatorWayBills) {
        this.updatorWayBills = updatorWayBills;
    }

    @OneToMany(mappedBy = "driver")
    public Set<WayBill> getDriverWayBills() {
        return driverWayBills;
    }

    public void setDriverWayBills(Set<WayBill> driverWayBills) {
        this.driverWayBills = driverWayBills;
    }


    @OneToMany(mappedBy = "createdByUsers")
    public Set<Application> getCreatorApplications() {
        return creatorApplications;
    }

    public void setCreatorApplications(Set<Application> creatorApplications) {
        this.creatorApplications = creatorApplications;
    }

    @OneToMany(mappedBy = "lastUpdatedByUsers")
    public Set<Application> getUpdatorApplications() {
        return updatorApplications;
    }

    public void setUpdatorApplications(Set<Application> updatorApplications) {
        this.updatorApplications = updatorApplications;
    }

    @Column(name = "is_active", nullable = false)
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

}
