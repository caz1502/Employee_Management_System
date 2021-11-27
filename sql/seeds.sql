USE company_db;

-- inserting department table
INSERT INTO department (id,name)
VALUES  (001, "CEO"),
        (002, "Procurement"),
        (003, "Logistics"),
        (004, "Finance"),
        (005, "Human_Resources");

-- inserting role table
INSERT INTO role (id, department_id, title, salary)
VALUES  (001, 001,"CEO",500000.00),
        (002, 002, "Procurment_Lead",250000.00),
        (003, 002, "Procurment_Officer",80000.00),
        (004, 003, "Logistics_Lead",250000.00),
        (005, 003, "Logistics_Officer",80000.00),
        (006, 004, "Finance_Lead",26000.00),
        (007, 004, "Accountant",150000.00),
        (008, 005, "Human_Resources_Lead",200000.00),
        (009, 005, "Human_Resources_Officer",80000.00);

-- inserting employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (001, "Big", "Kev", 001, null),
        (002, "Glen", "Spitty", 002, 001),
        (003, "Jim", "Smith", 002, 002),
        (004, "Tenille", "Harkins", 004, 001),
        (005, "Stuart", "Duncan", 005, 004),
        (006, "Kim", "Whitford", 006, 001),
        (007, "James", "Bond", 007, 006),
        (008, "Jessica", "Rabbit", 008, 001),
        (009, "Karl", "Jenner", 009, 008);
        
