package by.itech.lab.supplier.domain;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "role")
public class Role {
    private Long id;
    private String role;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "role_generator")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "role", nullable = false)
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", role='" + role + '\'' +
                '}';
    }


}
