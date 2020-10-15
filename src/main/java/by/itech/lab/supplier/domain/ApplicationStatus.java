package by.itech.lab.supplier.domain;


import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "application_status")
public class ApplicationStatus {
    private Long id;
    private String status;
    private Set<Application> applications = new HashSet<>();

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
    @OneToMany(mappedBy = "applicationStatus")
    public Set<Application> getApplications() {
        return applications;
    }

    public void setApplications(Set<Application> applications) {
        this.applications = applications;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApplicationStatus)) return false;
        ApplicationStatus that = (ApplicationStatus) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getStatus(), that.getStatus()) &&
                Objects.equals(getApplications(), that.getApplications());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getStatus(), getApplications());
    }

    @Override
    public String toString() {
        return "ApplicationStatus{" +
                "id=" + id +
                ", status='" + status + '\'' +
                ", applications=" + applications +
                '}';
    }
}
