package by.itech.lab.supplier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "write_off_act")
public class WriteOffAct {
    private Long id;
    private Double totalSum;
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
    public Double getTotalSum() {
        return totalSum;
    }

    public void setTotalSum(Double totalSum) {
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

}
