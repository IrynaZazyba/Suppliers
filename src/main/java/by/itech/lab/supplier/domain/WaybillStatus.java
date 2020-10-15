package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WaybillStatus)) return false;
        WaybillStatus that = (WaybillStatus) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getStatus(), that.getStatus()) &&
                Objects.equals(getWayBills(), that.getWayBills());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getStatus(), getWayBills());
    }

    @Override
    public String toString() {
        return "WaybillStatus{" +
                "id=" + id +
                ", status='" + status + '\'' +
                ", wayBills=" + wayBills +
                '}';
    }
}
