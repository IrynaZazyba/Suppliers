package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WriteOffActReason)) return false;
        WriteOffActReason that = (WriteOffActReason) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getReason(), that.getReason()) &&
                Objects.equals(getWriteOffActs(), that.getWriteOffActs());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getReason(), getWriteOffActs());
    }

    @Override
    public String toString() {
        return "WriteOffActReason{" +
                "id=" + id +
                ", reason='" + reason + '\'' +
                ", writeOffActs=" + writeOffActs +
                '}';
    }
}
