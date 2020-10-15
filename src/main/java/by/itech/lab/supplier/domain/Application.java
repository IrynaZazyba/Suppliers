package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.sql.Date;


@Entity
@Table(name = "application")
public class Application {

    private Long id;
    private String number;
    private Date registrationDate;
    private Date lastUpdated;
    private Address destinationLocationAddress;
    private User createdByUsers;
    private User lastUpdatedByUsers;
    private ApplicationStatus applicationStatus;
    private WayBill wayBill;

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

    @ManyToOne
    @JoinColumn(name = "source_location_address_id")
    public Address getDestinationLocationAddress() {
        return destinationLocationAddress;
    }

    public void setDestinationLocationAddress(Address destinationLocationAddress) {
        this.destinationLocationAddress = destinationLocationAddress;
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
    public User getLastUpdatedByUsers() {
        return lastUpdatedByUsers;
    }

    public void setLastUpdatedByUsers(User lastUpdatedByUsers) {
        this.lastUpdatedByUsers = lastUpdatedByUsers;
    }

    @ManyToOne
    @JoinColumn(name = "application_status_id")
    public ApplicationStatus getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(ApplicationStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    @ManyToOne
    @JoinColumn(name = "waybill_id")
    public WayBill getWayBill() {
        return wayBill;
    }

    public void setWayBill(WayBill wayBill) {
        this.wayBill = wayBill;
    }
}
