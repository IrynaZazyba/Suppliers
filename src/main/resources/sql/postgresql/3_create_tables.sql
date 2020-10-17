CREATE TABLE public.role
(
  id serial NOT NULL,
  role character varying(45) NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.address
(
  id serial NOT NULL,
  state character varying(45),
  city character varying(45),
  address_line_1 character varying(45),
  address_line_2 character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.customer
(
  id serial NOT NULL,
  name character varying(45),
  registration_date date,
  status character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.warehouse
(
  id serial NOT NULL,
  identifier character varying(45),
  type character varying(45),
  total_capacity numeric,
  address_id integer NOT NULL,
  customer_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.warehouse
  ADD CONSTRAINT "WAREHOUSE_ADDRESS" FOREIGN KEY (address_id)
    REFERENCES public.address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAREHOUSE_ADDRESS"
  ON public.warehouse(address_id);

ALTER TABLE public.warehouse
  ADD CONSTRAINT "WAREHOUSE_CUSTOMER" FOREIGN KEY (customer_id)
    REFERENCES public.customer (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAREHOUSE_CUSTOMER"
  ON public.warehouse(customer_id);

CREATE TABLE public."user"
(
  id serial NOT NULL,
  name character varying(45),
  surname character varying(45),
  birthday date,
  login character varying(45) NOT NULL,
  password character varying(45) NOT NULL,
  email character varying(45),
  role_id integer NOT NULL,
  address_id integer NOT NULL,
  customer_id integer NOT NULL,
  warehouse_id integer,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public."user"
  ADD CONSTRAINT "USER_ROLE" FOREIGN KEY (role_id)
    REFERENCES public.role (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_USER_ROLE"
  ON public."user"(role_id);

ALTER TABLE public."user"
  ADD CONSTRAINT "USER_ADDRESS" FOREIGN KEY (address_id)
    REFERENCES public.address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_USER_ADDRESS"
  ON public."user"(address_id);

ALTER TABLE public."user"
  ADD CONSTRAINT "USER_CUSTOMER" FOREIGN KEY (customer_id)
    REFERENCES public.customer (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_USER_CUSTOMER"
  ON public."user"(customer_id);

ALTER TABLE public."user"
  ADD CONSTRAINT "USER_WAREHOUSE" FOREIGN KEY (warehouse_id)
    REFERENCES public.warehouse (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_USER_WAREHOUSE"
  ON public."user"(warehouse_id);

CREATE TABLE public.category
(
  id serial NOT NULL,
  category character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.item
(
  id serial NOT NULL,
  upc numeric,
  label character varying(45),
  units numeric,
  category_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.item
  ADD CONSTRAINT "ITEM_CATEGORY" FOREIGN KEY (category_id)
    REFERENCES public.category (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_ITEM_CATEGORY"
  ON public.item(category_id);

CREATE TABLE public.items_in_warehouses
(
  id serial NOT NULL,
  item_id integer,
  warehouse_id integer,
  amount numeric,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.items_in_warehouses
  ADD CONSTRAINT "ITEM_STORED" FOREIGN KEY (item_id)
    REFERENCES public.item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_ITEM_STORED"
  ON public.items_in_warehouses(item_id);

ALTER TABLE public.items_in_warehouses
  ADD CONSTRAINT "WAREHOUSE_TO_STORE" FOREIGN KEY (warehouse_id)
    REFERENCES public.warehouse (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAREHOUSE_TO_STORE"
  ON public.items_in_warehouses(warehouse_id);

CREATE TABLE public.car
(
  id serial NOT NULL,
  "number" character varying(45),
  total_capacity numeric(45),
  current_capacity numeric,
  customer_id integer,
  address_id integer,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.car
  ADD CONSTRAINT "CAR_ADDRESS" FOREIGN KEY (address_id)
    REFERENCES public.address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_CAR_ADDRESS"
  ON public.car(address_id);

ALTER TABLE public.car
  ADD CONSTRAINT "CAR_CUSTOMER" FOREIGN KEY (customer_id)
    REFERENCES public.customer (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_CAR_CUSTOMER"
  ON public.car(customer_id);

CREATE TABLE public.retailer
(
  id serial NOT NULL,
  fullname character varying(45),
  identifier character varying(45),
  retailerscol character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.retailers_warehouses
(
  id serial NOT NULL,
  name character varying(45),
  warehouse_id integer,
  retailer_id integer,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.retailers_warehouses
  ADD CONSTRAINT "WAREHOUSE_OF_RETAILER" FOREIGN KEY (warehouse_id)
    REFERENCES public.warehouse (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAREHOUSE_OF_RETAILER"
  ON public.retailers_warehouses(warehouse_id);

ALTER TABLE public.retailers_warehouses
  ADD CONSTRAINT "RETAILER_FOR_WAREHOUSE" FOREIGN KEY (retailer_id)
    REFERENCES public.retailer (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_RETAILER_FOR_WAREHOUSE"
  ON public.retailers_warehouses(retailer_id);

CREATE TABLE public.waybill_status
(
  id serial NOT NULL,
  status character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.waybill
(
  id serial NOT NULL,
  "number" character varying(45),
  registration_date date,
  last_updated date,
  waybill_status_id integer NOT NULL,
  source_location_address_id integer NOT NULL,
  created_by_users_id integer NOT NULL,
  last_updated_by_users_id integer NOT NULL,
  car_id integer NOT NULL,
  car_driver_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.waybill
  ADD CONSTRAINT "WAYBILL_STATUS" FOREIGN KEY (waybill_status_id)
    REFERENCES public.waybill_status (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAYBILL_STATUS"
  ON public.waybill(waybill_status_id);

ALTER TABLE public.waybill
  ADD CONSTRAINT "WAYBILL_SOURCE_ADDRESS" FOREIGN KEY (source_location_address_id)
    REFERENCES public.address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAYBILL_SOURCE_ADDRESS"
  ON public.waybill(source_location_address_id);

ALTER TABLE public.waybill
  ADD CONSTRAINT "CREATOR" FOREIGN KEY (created_by_users_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_CREATOR"
  ON public.waybill(created_by_users_id);

ALTER TABLE public.waybill
  ADD CONSTRAINT "LAST_UPDATOR" FOREIGN KEY (last_updated_by_users_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_LAST_UPDATOR"
  ON public.waybill(last_updated_by_users_id);

ALTER TABLE public.waybill
  ADD CONSTRAINT "CAR_FOR_WAYBILL" FOREIGN KEY (car_id)
    REFERENCES public.car (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_CAR_FOR_WAYBILL"
  ON public.waybill(car_id);

ALTER TABLE public.waybill
  ADD CONSTRAINT "WAYBILL_CAR_DRIVER" FOREIGN KEY (car_driver_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WAYBILL_CAR_DRIVER"
  ON public.waybill(car_driver_id);

CREATE TABLE public.application_status
(
  id serial NOT NULL,
  status character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.application
(
  id serial NOT NULL,
  "number" character varying(45),
  registration_date date,
  last_updated date,
  source_location_address_id integer NOT NULL,
  destination_location_address_id integer NOT NULL,
  created_by_users_id integer NOT NULL,
  last_updated_by_users_id integer NOT NULL,
  application_status_id integer NOT NULL,
  waybill_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.application
  ADD CONSTRAINT "SOURCE_LOCATION_APPLICATION" FOREIGN KEY (source_location_address_id)
    REFERENCES public.address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_SOURCE_LOCATION_APPLICATION"
  ON public.application(source_location_address_id);

ALTER TABLE public.application
  ADD CONSTRAINT "DESTINATION_LOCATION_APPLICATION" FOREIGN KEY (destination_location_address_id)
    REFERENCES public.address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_DESTINATION_LOCATION_APPLICATION"
  ON public.application(destination_location_address_id);

ALTER TABLE public.application
  ADD CONSTRAINT "APPLICATION_CREATOR" FOREIGN KEY (created_by_users_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_APPLICATION_CREATOR"
  ON public.application(created_by_users_id);

ALTER TABLE public.application
  ADD CONSTRAINT "APPLICATION_LAST_UPDATOR" FOREIGN KEY (last_updated_by_users_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_APPLICATION_LAST_UPDATOR"
  ON public.application(last_updated_by_users_id);

ALTER TABLE public.application
  ADD CONSTRAINT "APPLICATION_STATUS" FOREIGN KEY (application_status_id)
    REFERENCES public.application_status (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_APPLICATION_STATUS"
  ON public.application(application_status_id);

ALTER TABLE public.application
  ADD CONSTRAINT "APPLICATION_WAYBILL" FOREIGN KEY (waybill_id)
    REFERENCES public.waybill (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_APPLICATION_WAYBILL"
  ON public.application(waybill_id);

CREATE TABLE public.items_in_application
(
  id serial NOT NULL,
  amount numeric,
  cost numeric,
  application_id integer NOT NULL,
  item_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.items_in_application
  ADD CONSTRAINT "APPLICATION_FOR_ITEM" FOREIGN KEY (application_id)
    REFERENCES public.application (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_APPLICATION_FOR_ITEM"
  ON public.items_in_application(application_id);

ALTER TABLE public.items_in_application
  ADD CONSTRAINT "ITEM_OF_APPLICATION" FOREIGN KEY (item_id)
    REFERENCES public.item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_ITEM_OF_APPLICATION"
  ON public.items_in_application(item_id);

CREATE TABLE public.tax
(
  id serial NOT NULL,
  amount numeric,
  percentage numeric,
  name character varying(45),
  zone_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.zone
(
  id serial NOT NULL,
  location character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.address
  ADD COLUMN zone_id integer;

ALTER TABLE public.address
  ADD CONSTRAINT "ZONE_OF_ADDRESS" FOREIGN KEY (zone_id)
    REFERENCES public.zone (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_ZONE_OF_ADDRESS"
  ON public.address(zone_id);

ALTER TABLE public.tax
  ADD CONSTRAINT "TAX_OF_ZONE" FOREIGN KEY (zone_id)
    REFERENCES public.zone (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_TAX_OF_ZONE"
  ON public.tax(zone_id);

CREATE TABLE public.write_off_act_reason
(
  id serial NOT NULL,
  reason character varying(45),
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

CREATE TABLE public.write_off_act
(
  id serial NOT NULL,
  total_sum numeric,
  date date,
  reason_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.write_off_act
  ADD CONSTRAINT "WRITE_OFF_REASON" FOREIGN KEY (reason_id)
    REFERENCES public.write_off_act_reason (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_WRITE_OFF_REASON"
  ON public.write_off_act(reason_id);

CREATE TABLE public.tax_per_distance
(
  id serial NOT NULL,
  tax_rate numeric,
  item_id integer NOT NULL,
  PRIMARY KEY (id)
)
  WITH (
    OIDS = FALSE
  );

ALTER TABLE public.tax_per_distance
  ADD CONSTRAINT "TAX_FOR_ITEM" FOREIGN KEY (item_id)
    REFERENCES public.item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
CREATE INDEX "fki_TAX_FOR_ITEM"
  ON public.tax_per_distance(item_id);
