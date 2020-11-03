package by.itech.lab.supplier.domain;

public enum ApplicationStatus {

    OPEN("Open"), STARTED_PROCESSING("Started processing"), FINISHED_PROCESSING("Finished processing");

    private String status;

    ApplicationStatus(final String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
