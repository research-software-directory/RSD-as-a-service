CREATE TABLE software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(100) UNIQUE NOT NULL,
	brand_name VARCHAR(100) NOT NULL,
	read_more VARCHAR
);
