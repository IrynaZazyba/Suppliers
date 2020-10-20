package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value =
            "SELECT * FROM user WHERE username = ?1 and customer_id=(SELECT id from customer where customer.name=?2)",
            nativeQuery = true)
    User findByUsernameAndCustomer(String username, String customer);

}
