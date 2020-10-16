package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "user")
public class User {

    private Long id;
    private String name;
    private String surname;
    private Date birthday;
    private String login;
    private String password;
    private String email;
    private Role role;
    private Address address;
    private Customer customer;
    private Warehouse warehouse;
    private Set<WayBill> creatorWayBills = new HashSet<>();
    private Set<WayBill> updatorWayBills = new HashSet<>();
    private Set<WayBill> driverWayBills = new HashSet<>();
    private Set<Application> creatorApplications = new HashSet<>();
    private Set<Application> updatorApplications = new HashSet<>();
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

    @Column(name = "login", nullable = false)
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @Column(name = "password", nullable = false)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "email", nullable = false)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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
    @OneToMany(mappedBy = "updatedByUsers")
    public Set<Application> getUpdatorApplications() {
        return updatorApplications;
    }

    public void setUpdatorApplications(Set<Application> updatorApplications) {
        this.updatorApplications = updatorApplications;
    }



    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", birthday=" + birthday +
                ", login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", address=" + address +
                ", customer=" + customer +
                ", warehouse=" + warehouse +
                ", creatorWayBills=" + creatorWayBills +
                ", updatorWayBills=" + updatorWayBills +
                ", driverWayBills=" + driverWayBills +
                ", creatorApplications=" + creatorApplications +
                ", updatorApplications=" + updatorApplications +
                '}';
    }
}
