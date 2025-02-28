DROP DATABASE IF EXISTS france;
CREATE DATABASE france;
USE france;

CREATE TABLE IF NOT EXISTS countries (
    id VARCHAR(2) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
    id VARCHAR(2) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    country_id VARCHAR(2) NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(3) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    region_id VARCHAR(2) NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE IF NOT EXISTS municipalities (
    id VARCHAR(5) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    postalCodes VARCHAR(255) NOT NULL,
    coordinates VARCHAR(255) NOT NULL,
    population INT NOT NULL,
    department_id VARCHAR(3) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);