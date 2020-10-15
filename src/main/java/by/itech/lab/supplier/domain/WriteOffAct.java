package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "write_off_act")
public class WriteOffAct {
    private Long id;
    private int totalSum;
    private Date date;
    private WriteOffActReason writeOffActReason;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "total_sum")
    public int getTotalSum() {
        return totalSum;
    }

    public void setTotalSum(int totalSum) {
        this.totalSum = totalSum;
    }

    @Column(name = "date")
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    @ManyToOne
    @JoinColumn(name = "reason_id")
    public WriteOffActReason getWriteOffActReason() {
        return writeOffActReason;
    }

    public void setWriteOffActReason(WriteOffActReason writeOffActReason) {
        this.writeOffActReason = writeOffActReason;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WriteOffAct)) return false;
        WriteOffAct that = (WriteOffAct) o;
        return getTotalSum() == that.getTotalSum() &&
                Objects.equals(getId(), that.getId()) &&
                Objects.equals(getDate(), that.getDate()) &&
                Objects.equals(getWriteOffActReason(), that.getWriteOffActReason());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTotalSum(), getDate(), getWriteOffActReason());
    }

    @Override
    public String toString() {
        return "WriteOffAct{" +
                "id=" + id +
                ", totalSum=" + totalSum +
                ", date=" + date +
                ", writeOffActReason=" + writeOffActReason +
                '}';
    }
}
