package by.itech.lab.supplier.domain;

public enum WaybillStatus {
    OPEN("Open"), READY("Ready"), IN_PROGRESS("In progress"), FINISHED("Finished");
    private String status;

    WaybillStatus(final String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}