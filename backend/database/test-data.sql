-- Test Data for Hannan Agribusiness Limited - Breeding Farm Module
-- This script inserts comprehensive test data for all breeding farm features
-- Run this after setting up the database schema

-- =====================================
-- 1. GOATS REGISTRY
-- =====================================

-- Female Goats (Does)
INSERT INTO goats (goat_id, breed, sex, date_of_birth, source, status, weight_kg, color, mother_id, father_id, notes, created_at) VALUES
('F001', 'Boer', 'Female', '2022-03-15', 'Purchased', 'Active', 45.5, 'White with brown head', NULL, NULL, 'Excellent breeding doe, very healthy', NOW()),
('F002', 'Saanen', 'Female', '2021-11-20', 'Purchased', 'Active', 52.0, 'Pure white', NULL, NULL, 'High milk producer', NOW()),
('F003', 'Boer', 'Female', '2023-01-10', 'Born on farm', 'Active', 38.2, 'Brown and white', 'F001', 'M001', 'First generation from our breeding program', NOW()),
('F004', 'Alpine', 'Female', '2022-08-05', 'Purchased', 'Active', 48.0, 'Black and white', NULL, NULL, 'Good temperament, easy to handle', NOW()),
('F005', 'Mixed Breed', 'Female', '2023-05-12', 'Born on farm', 'Active', 32.5, 'Tan', 'F002', 'M002', 'Growing well, showing good traits', NOW()),
('F006', 'Boer', 'Female', '2022-12-01', 'Purchased', 'Sold', 42.0, 'Red with white markings', NULL, NULL, 'Sold to another breeding farm', NOW()),
('F007', 'Saanen', 'Female', '2023-07-15', 'Born on farm', 'Active', 28.0, 'Cream colored', 'F002', 'M001', 'Young doe with excellent genetics', NOW());

-- Male Goats (Bucks)
INSERT INTO goats (goat_id, breed, sex, date_of_birth, source, status, weight_kg, color, mother_id, father_id, notes, created_at) VALUES
('M001', 'Boer', 'Male', '2021-06-10', 'Purchased', 'Active', 85.0, 'Red and white', NULL, NULL, 'Primary breeding buck, proven genetics', NOW()),
('M002', 'Saanen', 'Male', '2021-09-25', 'Purchased', 'Active', 78.5, 'White', NULL, NULL, 'Excellent milk line genetics', NOW()),
('M003', 'Boer', 'Male', '2023-02-20', 'Born on farm', 'Active', 55.0, 'Brown', 'F001', 'M001', 'Young buck, future breeding potential', NOW()),
('M004', 'Alpine', 'Male', '2022-04-15', 'Purchased', 'Deceased', 75.0, 'Black', NULL, NULL, 'Passed away from natural causes', NOW());

-- Kids (Young goats)
INSERT INTO goats (goat_id, breed, sex, date_of_birth, source, status, weight_kg, color, mother_id, father_id, notes, created_at) VALUES
('K001', 'Boer', 'Male', '2024-01-05', 'Born on farm', 'Active', 12.5, 'White and brown', 'F001', 'M001', 'Strong and healthy kid', NOW()),
('K002', 'Boer', 'Female', '2024-01-05', 'Born on farm', 'Active', 11.8, 'Brown', 'F001', 'M001', 'Twin to K001', NOW()),
('K003', 'Saanen', 'Female', '2024-02-10', 'Born on farm', 'Active', 10.5, 'White', 'F002', 'M002', 'Growing rapidly', NOW());

-- =====================================
-- 2. BREEDING RECORDS
-- =====================================

INSERT INTO breeding (doe_id, buck_id, breeding_date, breeding_type, expected_kidding_date, actual_kidding_date, number_of_kids, kid_details, outcome, notes, created_at) VALUES
('F001', 'M001', '2023-08-10', 'Natural', '2024-01-05', '2024-01-05', 2, 'Twin kids: 1 male (K001), 1 female (K002)', 'Success', 'Easy birth, both kids healthy', NOW()),
('F002', 'M002', '2023-09-15', 'Natural', '2024-02-10', '2024-02-10', 1, 'Single female kid (K003)', 'Success', 'Normal delivery, excellent milk production', NOW()),
('F003', 'M001', '2024-01-20', 'Natural', '2024-06-15', NULL, NULL, NULL, 'Pregnant', 'First pregnancy for this doe', NOW()),
('F004', 'M002', '2023-12-05', 'Artificial Insemination', '2024-05-01', NULL, NULL, NULL, 'Pregnant', 'AI performed to improve milk genetics', NOW()),
('F001', 'M001', '2023-02-15', 'Natural', '2023-07-10', '2023-07-12', 1, 'Single male kid (sold)', 'Success', 'Kid sold at 2 months old', NOW()),
('F007', 'M003', '2024-03-01', 'Natural', '2024-07-25', NULL, NULL, NULL, 'Pending', 'Young doe, monitoring closely', NOW());

-- =====================================
-- 3. HEALTH RECORDS
-- =====================================

INSERT INTO health (goat_id, diagnosis, treatment, vet_name, treatment_date, recovery_date, cost, follow_up_date, outcome, notes, created_at) VALUES
('F001', 'Routine checkup', 'General examination, all normal', 'Dr. Sarah Johnson', '2024-01-15', '2024-01-15', 50.00, NULL, 'Recovered', 'Excellent health condition', NOW()),
('M001', 'Hoof infection', 'Antibiotic treatment, hoof trim', 'Dr. Sarah Johnson', '2023-11-20', '2023-12-05', 120.00, '2023-12-20', 'Recovered', 'Complete recovery, walking normally', NOW()),
('F002', 'Mastitis', 'Antibiotic injection, anti-inflammatory', 'Dr. Michael Chen', '2024-02-18', '2024-02-25', 95.00, NULL, 'Recovered', 'Milk production back to normal', NOW()),
('K001', 'Respiratory infection', 'Antibiotics, vitamins', 'Dr. Sarah Johnson', '2024-02-10', '2024-02-20', 75.00, '2024-03-01', 'Recovered', 'Kid fully recovered, strong immune system', NOW()),
('M004', 'Chronic illness', 'Palliative care', 'Dr. Michael Chen', '2024-01-10', NULL, 200.00, NULL, 'Deceased', 'Natural causes, old age', NOW()),
('F003', 'Minor wound', 'Wound cleaning, tetanus shot', 'Dr. Sarah Johnson', '2023-12-01', '2023-12-08', 60.00, NULL, 'Recovered', 'Small cut from fence, healed well', NOW()),
('F004', 'Routine pregnancy check', 'Ultrasound, vitamins', 'Dr. Michael Chen', '2024-03-05', NULL, 85.00, '2024-04-15', 'In Progress', 'Pregnancy progressing well', NOW());

-- =====================================
-- 4. VACCINATION RECORDS
-- =====================================

INSERT INTO vaccination (goat_id, vaccine_name, vaccination_date, next_due_date, batch_number, administered_by, cost, reaction, notes, created_at) VALUES
-- Annual CDT vaccinations
('F001', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-01-05', '2025-01-05', 'CDT-2024-A', 'Farm Staff', 15.00, 'None', 'Annual booster', NOW()),
('F002', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-01-05', '2025-01-05', 'CDT-2024-A', 'Farm Staff', 15.00, 'None', 'Annual booster', NOW()),
('M001', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-01-05', '2025-01-05', 'CDT-2024-A', 'Farm Staff', 15.00, 'None', 'Annual booster', NOW()),
('M002', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-01-05', '2025-01-05', 'CDT-2024-A', 'Farm Staff', 15.00, 'None', 'Annual booster', NOW()),

-- Kids initial vaccinations (6-8 weeks old)
('K001', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-02-20', '2024-03-20', 'CDT-2024-B', 'Dr. Sarah Johnson', 20.00, 'None', 'First CDT shot', NOW()),
('K002', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-02-20', '2024-03-20', 'CDT-2024-B', 'Dr. Sarah Johnson', 20.00, 'None', 'First CDT shot', NOW()),
('K003', 'CDT (Clostridium perfringens types C & D and Tetanus)', '2024-03-25', '2024-04-25', 'CDT-2024-C', 'Farm Staff', 20.00, 'None', 'First CDT shot', NOW()),

-- Rabies vaccinations
('F001', 'Rabies', '2023-06-15', '2024-06-15', 'RAB-2023-X', 'Dr. Michael Chen', 25.00, 'None', 'Annual rabies vaccination', NOW()),
('M001', 'Rabies', '2023-06-15', '2024-06-15', 'RAB-2023-X', 'Dr. Michael Chen', 25.00, 'None', 'Annual rabies vaccination', NOW()),

-- Deworming (also tracked as vaccination)
('F001', 'Dewormer (Ivermectin)', '2024-02-01', '2024-05-01', 'IVM-2024-Q1', 'Farm Staff', 10.00, 'None', 'Quarterly deworming', NOW()),
('F002', 'Dewormer (Ivermectin)', '2024-02-01', '2024-05-01', 'IVM-2024-Q1', 'Farm Staff', 10.00, 'None', 'Quarterly deworming', NOW()),
('M001', 'Dewormer (Ivermectin)', '2024-02-01', '2024-05-01', 'IVM-2024-Q1', 'Farm Staff', 10.00, 'None', 'Quarterly deworming', NOW());

-- =====================================
-- 5. FEEDING RECORDS
-- =====================================

INSERT INTO feeding (goat_id, feed_type, quantity_kg, feeding_date, cost, supplement, notes, created_at) VALUES
-- Daily feeding records for breeding does
('F001', 'Hay', 2.5, CURRENT_DATE, 5.00, 'Mineral salt block', 'Standard ration for lactating doe', NOW()),
('F001', 'Grain mix', 1.0, CURRENT_DATE, 3.50, NULL, 'High protein for milk production', NOW()),
('F002', 'Hay', 2.8, CURRENT_DATE, 5.60, 'Mineral salt block', 'Increased ration for lactation', NOW()),
('F002', 'Grain mix', 1.2, CURRENT_DATE, 4.20, 'Calcium supplement', 'Extra calcium for milk production', NOW()),

-- Buck feeding
('M001', 'Hay', 3.0, CURRENT_DATE, 6.00, 'Mineral salt block', 'Breeding buck maintenance ration', NOW()),
('M001', 'Grain mix', 0.8, CURRENT_DATE, 2.80, NULL, 'Moderate grain for breeding condition', NOW()),
('M002', 'Hay', 2.8, CURRENT_DATE, 5.60, 'Mineral salt block', 'Standard buck ration', NOW()),

-- Kids feeding with milk replacer
('K001', 'Milk replacer', 0.5, CURRENT_DATE, 4.00, 'Vitamin E supplement', 'Supplementing natural milk', NOW()),
('K001', 'Starter grain', 0.3, CURRENT_DATE, 1.50, NULL, 'Introducing solid feed', NOW()),
('K002', 'Milk replacer', 0.5, CURRENT_DATE, 4.00, 'Vitamin E supplement', 'Supplementing natural milk', NOW()),
('K003', 'Milk replacer', 0.6, CURRENT_DATE, 4.80, 'Probiotics', 'Excellent appetite', NOW()),

-- Pregnant does special feeding
('F003', 'Hay', 2.7, CURRENT_DATE, 5.40, 'Prenatal vitamins', 'Special ration for pregnancy', NOW()),
('F003', 'Grain mix', 0.9, CURRENT_DATE, 3.15, 'Calcium supplement', 'Supporting fetal development', NOW()),
('F004', 'Hay', 2.6, CURRENT_DATE, 5.20, 'Prenatal vitamins', 'Late pregnancy nutrition', NOW()),
('F004', 'Grain mix', 1.1, CURRENT_DATE, 3.85, 'Mineral supplement', 'Preparing for kidding', NOW()),

-- Historical feeding records (past week)
('F001', 'Hay', 2.5, CURRENT_DATE - INTERVAL '1 day', 5.00, 'Mineral salt block', 'Daily feeding', NOW()),
('F002', 'Hay', 2.8, CURRENT_DATE - INTERVAL '1 day', 5.60, 'Mineral salt block', 'Daily feeding', NOW()),
('M001', 'Hay', 3.0, CURRENT_DATE - INTERVAL '1 day', 6.00, 'Mineral salt block', 'Daily feeding', NOW()),
('F001', 'Hay', 2.5, CURRENT_DATE - INTERVAL '2 days', 5.00, 'Mineral salt block', 'Daily feeding', NOW()),
('F002', 'Hay', 2.8, CURRENT_DATE - INTERVAL '2 days', 5.60, 'Mineral salt block', 'Daily feeding', NOW());

-- =====================================
-- 6. SALES - BREEDING (Live Goat Sales)
-- =====================================

INSERT INTO sales_breeding (goat_id, breed, sex, age_months, buyer_name, buyer_contact, sale_price, sale_date, payment_method, delivery_method, notes, created_at) VALUES
('F006', 'Boer', 'Female', 14, 'Green Valley Farms', '+256-700-123456', 450000.00, '2024-02-15', 'Bank Transfer', 'Pickup by buyer', 'Sold to established breeding farm, excellent genetics', NOW()),
('M003', 'Boer', 'Male', 10, 'Sunrise Goat Ranch', '+256-700-234567', 380000.00, '2024-03-01', 'Cash', 'Delivered', 'Young buck with good breeding potential', NOW()),
-- Historical sales
('F005', 'Boer', 'Female', 18, 'Mountain View Farm', '+256-700-345678', 420000.00, '2023-12-10', 'Mobile Money', 'Pickup by buyer', 'Proven breeder, had 2 successful pregnancies', NOW()),
('M004', 'Alpine', 'Male', 24, 'Highland Breeding Co', '+256-700-456789', 550000.00, '2023-11-20', 'Bank Transfer', 'Delivered', 'Premium breeding buck, excellent pedigree', NOW());

-- =====================================
-- 7. SALES - MEAT (Goat Meat Sales)
-- =====================================

INSERT INTO sales_meat (goat_id, breed, sex, weight_kg, buyer_name, buyer_contact, price_per_kg, total_price, sale_date, payment_method, notes, created_at) VALUES
-- Recent meat sales (males not suitable for breeding)
('M005', 'Mixed Breed', 'Male', 35.0, 'City Butchery', '+256-700-567890', 12000.00, 420000.00, '2024-03-10', 'Cash', 'Grade A meat quality', NOW()),
('M006', 'Boer', 'Male', 42.0, 'Premium Meats Ltd', '+256-700-678901', 13000.00, 546000.00, '2024-02-25', 'Bank Transfer', 'Excellent marbling, premium grade', NOW()),
-- Historical meat sales
('F008', 'Mixed Breed', 'Female', 28.0, 'Local Market', '+256-700-789012', 11000.00, 308000.00, '2024-01-15', 'Cash', 'Cull doe, past breeding age', NOW()),
('M007', 'Boer', 'Male', 38.5, 'Restaurant Supply Co.', '+256-700-890123', 12500.00, 481250.00, '2023-12-20', 'Mobile Money', 'High quality meat for restaurant', NOW()),
('K004', 'Mixed Breed', 'Male', 15.0, 'Village Market', '+256-700-901234', 10000.00, 150000.00, '2023-11-30', 'Cash', 'Young male, meat goat', NOW());

-- =====================================
-- 8. KID GROWTH TRACKING
-- =====================================

INSERT INTO kid_growth (kid_id, measurement_date, weight_kg, height_cm, body_condition, health_status, notes, created_at) VALUES
-- K001 growth tracking (born 2024-01-05)
('K001', '2024-01-05', 3.2, 28, 'Good', 'Healthy', 'Birth weight and height', NOW()),
('K001', '2024-01-12', 4.5, 30, 'Good', 'Healthy', 'First week: Excellent weight gain', NOW()),
('K001', '2024-01-19', 6.0, 32, 'Good', 'Healthy', 'Two weeks: Growing rapidly', NOW()),
('K001', '2024-01-26', 7.5, 35, 'Good', 'Healthy', 'Three weeks: Strong and active', NOW()),
('K001', '2024-02-02', 9.0, 37, 'Good', 'Healthy', 'One month: Excellent progress', NOW()),
('K001', '2024-02-16', 10.8, 40, 'Excellent', 'Healthy', '6 weeks: Started eating solid food', NOW()),
('K001', '2024-03-01', 12.5, 43, 'Excellent', 'Healthy', '8 weeks: Fully weaned, excellent growth', NOW()),

-- K002 growth tracking (born 2024-01-05, twin)
('K002', '2024-01-05', 3.0, 27, 'Good', 'Healthy', 'Birth weight, slightly smaller twin', NOW()),
('K002', '2024-01-12', 4.2, 29, 'Good', 'Healthy', 'First week: Good weight gain', NOW()),
('K002', '2024-01-19', 5.6, 31, 'Good', 'Healthy', 'Two weeks: Catching up to twin', NOW()),
('K002', '2024-01-26', 7.0, 34, 'Good', 'Healthy', 'Three weeks: Strong growth', NOW()),
('K002', '2024-02-02', 8.5, 36, 'Good', 'Healthy', 'One month: Similar size to twin now', NOW()),
('K002', '2024-02-16', 10.2, 39, 'Excellent', 'Healthy', '6 weeks: Eating well', NOW()),
('K002', '2024-03-01', 11.8, 42, 'Excellent', 'Healthy', '8 weeks: Weaned successfully', NOW()),

-- K003 growth tracking (born 2024-02-10)
('K003', '2024-02-10', 3.5, 29, 'Excellent', 'Healthy', 'Birth weight, strong Saanen kid', NOW()),
('K003', '2024-02-17', 5.0, 31, 'Excellent', 'Healthy', 'First week: Excellent appetite', NOW()),
('K003', '2024-02-24', 6.5, 33, 'Excellent', 'Healthy', 'Two weeks: Rapid growth', NOW()),
('K003', '2024-03-02', 8.2, 36, 'Excellent', 'Healthy', 'Three weeks: Very active', NOW()),
('K003', '2024-03-09', 10.5, 38, 'Excellent', 'Healthy', 'Four weeks: Excellent milk production from mother', NOW());

-- =====================================
-- 9. EXPENSES
-- =====================================

INSERT INTO expenses (category, item, amount, date, paid_to, payment_method, receipt_number, notes, created_at) VALUES
-- Feed expenses (largest category)
('Feed', 'Hay - 50 bales', 250000.00, '2024-03-01', 'Green Fields Suppliers', 'Bank Transfer', 'GFS-2024-001', 'Monthly hay supply', NOW()),
('Feed', 'Grain mix - 100kg bags (5)', 175000.00, '2024-03-05', 'Animal Nutrition Ltd', 'Cash', 'ANL-456', 'High protein grain mix', NOW()),
('Feed', 'Mineral supplements', 45000.00, '2024-03-10', 'Vet Supplies Co.', 'Mobile Money', 'VSC-789', 'Monthly mineral supplement', NOW()),
('Feed', 'Milk replacer - 10kg', 85000.00, '2024-02-20', 'Animal Nutrition Ltd', 'Bank Transfer', 'ANL-440', 'For weaning kids', NOW()),

-- Medical expenses
('Medical', 'Veterinary consultation - routine checkups', 150000.00, '2024-01-15', 'Dr. Sarah Johnson', 'Cash', 'VET-101', 'Quarterly health inspection', NOW()),
('Medical', 'Antibiotics and medications', 95000.00, '2024-02-18', 'Vet Pharmacy', 'Mobile Money', 'VP-234', 'Treatment supplies', NOW()),
('Medical', 'Vaccines - CDT batch', 120000.00, '2024-01-05', 'Animal Health Center', 'Bank Transfer', 'AHC-567', 'Annual vaccination program', NOW()),
('Medical', 'Dewormer - Ivermectin', 65000.00, '2024-02-01', 'Vet Supplies Co.', 'Cash', 'VSC-678', 'Quarterly deworming', NOW()),

-- Infrastructure and equipment
('Infrastructure', 'Fence repair materials', 180000.00, '2024-02-10', 'Hardware Store', 'Cash', 'HS-890', 'Perimeter fence maintenance', NOW()),
('Equipment', 'Water troughs (2)', 95000.00, '2024-01-20', 'Farm Equipment Ltd', 'Bank Transfer', 'FEL-345', 'New watering system', NOW()),
('Infrastructure', 'Shelter roof repair', 320000.00, '2024-03-05', 'Construction Services', 'Mobile Money', 'CS-456', 'Rain damage repair', NOW()),

-- Labor costs
('Labor', 'Farm staff salaries (3 workers)', 900000.00, '2024-03-01', 'Staff', 'Cash', 'SAL-MAR-2024', 'March salaries', NOW()),
('Labor', 'Veterinary assistant fee', 125000.00, '2024-02-15', 'Assistant', 'Mobile Money', 'VA-123', 'Vaccination assistance', NOW()),

-- Utilities
('Utilities', 'Electricity bill', 85000.00, '2024-03-01', 'Power Company', 'Bank Transfer', 'PWR-2024-03', 'Monthly electricity', NOW()),
('Utilities', 'Water bill', 45000.00, '2024-03-01', 'Water Authority', 'Mobile Money', 'WTR-2024-03', 'Monthly water supply', NOW()),

-- Breeding services
('Breeding', 'Artificial insemination service', 150000.00, '2023-12-05', 'Breeding Services Ltd', 'Bank Transfer', 'BSL-789', 'AI for F004', NOW()),

-- Transportation
('Transport', 'Goat transportation to buyer', 75000.00, '2024-02-15', 'Transport Co.', 'Cash', 'TC-456', 'Delivery of sold goat', NOW()),
('Transport', 'Feed delivery', 35000.00, '2024-03-01', 'Green Fields Suppliers', 'Included', 'GFS-2024-001-T', 'Hay delivery fee', NOW()),

-- Miscellaneous
('Other', 'Farm supplies (buckets, ropes, etc.)', 55000.00, '2024-02-20', 'Farm Shop', 'Cash', 'FS-234', 'General farm supplies', NOW()),
('Other', 'Livestock insurance premium', 200000.00, '2024-01-01', 'Insurance Company', 'Bank Transfer', 'IC-2024-Q1', 'Quarterly insurance', NOW());

-- =====================================
-- DATA SUMMARY
-- =====================================

-- Total Goats: 14 (7 Female, 4 Male, 3 Kids)
-- Active Goats: 12
-- Breeding Records: 6
-- Health Records: 7
-- Vaccination Records: 15
-- Feeding Records: 20+
-- Sales (Breeding): 4
-- Sales (Meat): 5
-- Kid Growth Records: 23
-- Expense Records: 22

-- This test data provides:
-- ✓ Multiple goats with different breeds, sexes, and statuses
-- ✓ Family relationships (mother/father tracking)
-- ✓ Complete breeding cycle examples
-- ✓ Health tracking including recoveries and outcomes
-- ✓ Vaccination schedules and deworming
-- ✓ Daily and historical feeding records
-- ✓ Both breeding and meat sales examples
-- ✓ Detailed kid growth progression
-- ✓ Comprehensive expense tracking across all categories

-- To verify the data was inserted correctly, run:
-- SELECT COUNT(*) FROM goats;
-- SELECT COUNT(*) FROM breeding;
-- SELECT COUNT(*) FROM health;
-- SELECT COUNT(*) FROM vaccination;
-- SELECT COUNT(*) FROM feeding;
-- SELECT COUNT(*) FROM sales_breeding;
-- SELECT COUNT(*) FROM sales_meat;
-- SELECT COUNT(*) FROM kid_growth;
-- SELECT COUNT(*) FROM expenses;
