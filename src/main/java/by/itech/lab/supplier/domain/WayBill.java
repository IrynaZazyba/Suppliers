package by.itech.lab.supplier.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

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
@Table(name = "waybill")
@FilterDef(name = "accessFilter", parameters = @ParamDef(name = "companyId", type = "long"))
@Filter(name = "accessFilter", condition = "customer_id = :companyId")
public class WayBill implements BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String number;
    @Column(nullable = false)
    private Date registrationDate;
    @Column(nullable = false)
    private Date lastUpdated;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WaybillStatus waybillStatus;
    @ManyToOne
    @JoinColumn(name = "source_location_address_id", nullable = false)
    private Address sourceLocationAddress;
    @ManyToOne
    @JoinColumn(name = "created_by_users_id", nullable = false)
    private User createdByUsers;
    @ManyToOne
    @JoinColumn(name = "last_updated_by_users_id", nullable = false)
    private User updatedByUsers;
    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;
    @ManyToOne
    @JoinColumn(name = "car_driver_id")
    private User driver;
    private Long customerId;

}
