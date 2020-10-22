package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Customer;
import java.util.Optional;

public class CustomerRepositoryImp implements CustomerRepository {


    @Override
    public <S extends Customer> S save(S s) {
        return null;
    }

    @Override
    public <S extends Customer> Iterable<S> saveAll(Iterable<S> iterable) {
        return null;
    }

    @Override
    public Optional<Customer> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(Long aLong) {
        return false;
    }

    @Override
    public Iterable<Customer> findAll() {
        return null;
    }

    @Override
    public Iterable<Customer> findAllById(Iterable<Long> iterable) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(Long aLong) {

    }

    @Override
    public void delete(Customer customer) {

    }

    @Override
    public void deleteAll(Iterable<? extends Customer> iterable) {

    }

    @Override
    public void deleteAll() {

    }
}
