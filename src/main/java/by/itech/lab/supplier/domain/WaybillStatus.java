package by.itech.lab.supplier.domain;

public enum WaybillStatus {
    WAITING("Waiting"), IN_PROGRESS("In progress"), COMPLETED("Completed");
    private String status;

    WaybillStatus(final String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}