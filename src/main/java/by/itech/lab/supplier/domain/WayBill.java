package by.itech.lab.supplier.domain;


import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "waybill")
public class WayBill {

    private Long id;
    private String number;
    private Date registrationDate;
    private Date lastUpdated;
    private WaybillStatus waybillStatus;
    private Address sourceLocationAddress;
    private User createdByUsers;
    private User updatedByUsers;
    private Car car;
    private User driver;
    private Set<Application> applications = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "number")
    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    @Column(name = "registration_date")
    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    @Column(name = "last_updated")
    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }


    @Column(name = "waybill_status")
    @Enumerated(EnumType.STRING)
    public WaybillStatus getWaybillStatus() {
        return waybillStatus;
    }

    public void setWaybillStatus(WaybillStatus waybillStatus) {
        this.waybillStatus = waybillStatus;
    }

    @ManyToOne
    @JoinColumn(name = "source_location_address_id")
    public Address getSourceLocationAddress() {
        return sourceLocationAddress;
    }

    public void setSourceLocationAddress(Address sourceLocationAddress) {
        this.sourceLocationAddress = sourceLocationAddress;
    }

    @ManyToOne
    @JoinColumn(name = "created_by_users_id")
    public User getCreatedByUsers() {
        return createdByUsers;
    }

    public void setCreatedByUsers(User createdByUsers) {
        this.createdByUsers = createdByUsers;
    }

    @ManyToOne
    @JoinColumn(name = "last_updated_by_users_id")
    public User getUpdatedByUsers() {
        return updatedByUsers;
    }

    public void setUpdatedByUsers(User updatedByUsers) {
        this.updatedByUsers = updatedByUsers;
    }

    @ManyToOne
    @JoinColumn(name = "car_id")
    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    @ManyToOne
    @JoinColumn(name = "car_driver_id")
    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }

    @OneToMany(mappedBy = "wayBill")
    public Set<Application> getApplications() {
        return applications;
    }

    public void setApplications(Set<Application> applications) {
        this.applications = applications;
    }



    @Override
    public String toString() {
        return "WayBill{" +
                "id=" + id +
                ", number='" + number + '\'' +
                ", registrationDate=" + registrationDate +
                ", lastUpdated=" + lastUpdated +
                ", waybillStatus=" + waybillStatus +
                ", sourceLocationAddress=" + sourceLocationAddress +
                ", createdByUsers=" + createdByUsers +
                ", updatedByUsers=" + updatedByUsers +
                ", car=" + car +
                ", driver=" + driver +
                ", applications=" + applications +
                '}';
    }
}
