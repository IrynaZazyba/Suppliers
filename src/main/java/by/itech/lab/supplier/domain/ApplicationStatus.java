package by.itech.lab.supplier.domain;

public enum ApplicationStatus {

    WAITING("Waiting"), IN_PROGRESS("In progress"), COMPLETED("Completed");

    private String status;

    ApplicationStatus(final String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
