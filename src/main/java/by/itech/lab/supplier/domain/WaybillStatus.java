package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "waybill_status")
public class WaybillStatus {
    private Long id;
    private String status;
    private Set<WayBill> wayBills = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "status", nullable = false)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    @OneToMany(mappedBy = "waybillStatus")
    public Set<WayBill> getWayBills() {
        return wayBills;
    }

    public void setWayBills(Set<WayBill> wayBills) {
        this.wayBills = wayBills;
    }

}
