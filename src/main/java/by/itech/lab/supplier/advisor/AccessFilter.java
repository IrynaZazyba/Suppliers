package by.itech.lab.supplier.advisor;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.Role;
import lombok.AllArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.hibernate.Filter;
import org.hibernate.internal.SessionImpl;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.util.Objects;

@Component
@AllArgsConstructor
@Aspect
public class AccessFilter {

    private static final String FILTER_NAME = "accessFilter";
    private static final String FILTER_PARAMETER = "companyId";
    private final EntityManager entityManager;
    private final ThreadLocal threadLocal;

    @Pointcut("execution(public !void by.itech.lab.supplier.repository.*.*(..))")
    protected void any() {
        //all repository methods
    }

    @Around(value = "any()")
    public Object accessFilter(final ProceedingJoinPoint point) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) {
            return point.proceed();
        }

        if (!authentication.getPrincipal().getClass().isAssignableFrom(UserImpl.class)) {
            return point.proceed();
        }
        UserImpl principal = (UserImpl) authentication.getPrincipal();

        if (principal.getAuthorities().contains(Role.ROLE_SYSTEM_ADMIN)) {
            return point.proceed();
        }
        Long customerId = (Long) threadLocal.get();

        if (!principal.atCustomer(customerId)) {
            throw new AccessDeniedException("No access");
        }

        SessionImpl delegate = (SessionImpl) entityManager.getDelegate();
        Filter accessFilter = delegate.enableFilter(FILTER_NAME);
        accessFilter.setParameter(FILTER_PARAMETER, customerId);
        Object proceed = point.proceed();
        delegate.disableFilter(FILTER_NAME);
        return proceed;
    }

}
