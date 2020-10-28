package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "application")
public class Application implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String number;
    @Column(nullable = false)
    private Date registrationDate;
    @Column(nullable = false)
    private Date lastUpdated;
    @ManyToOne
    @JoinColumn(name = "source_location_address_id")
    private Address sourceLocationAddressId;
    @ManyToOne
    @JoinColumn(name = "created_by_users_id")
    private User createdByUsers;
    @ManyToOne
    @JoinColumn(name = "last_updated_by_users_id")
    private User lastUpdatedByUsers;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;
    @ManyToOne
    @JoinColumn(name = "waybill_id")
    private WayBill wayBill;

}
