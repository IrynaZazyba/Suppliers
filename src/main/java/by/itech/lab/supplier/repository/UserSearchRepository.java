package by.itech.lab.supplier.repository;


import by.itech.lab.supplier.domain.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface UserSearchRepository extends ElasticsearchRepository<User, Long> {
}