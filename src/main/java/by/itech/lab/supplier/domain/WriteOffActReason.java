package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "write_off_act_reason")
public class WriteOffActReason {
    private Long id;
    private String reason;
    private Set<WriteOffAct> writeOffActs = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "reason", nullable = false)
    public String getReason() {
        return reason;
    }

    public void setReason(String category) {
        this.reason = category;
    }

    @OneToMany(mappedBy = "writeOffActReason")
    public Set<WriteOffAct> getWriteOffActs() {
        return writeOffActs;
    }

    public void setWriteOffActs(Set<WriteOffAct> writeOffActs) {
        this.writeOffActs = writeOffActs;
    }
}
