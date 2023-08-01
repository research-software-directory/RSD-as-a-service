-- SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: EUPL-1.2

-- THIS FILE SHOULD BE MOVED TO THE DEPLOMENT REPO AND USED AS A MIGRATION FILE

CREATE FUNCTION add_category(parent_name varchar, parent_short_name varchar, sub_categories varchar[][])
RETURNS TABLE (LIKE category)
LANGUAGE plpgsql
AS $$
DECLARE parent_id uuid;
DECLARE category varchar[];
BEGIN
  INSERT INTO category(short_name, name) VALUES (parent_short_name, parent_name)
    RETURNING id INTO parent_id;
  FOREACH category SLICE 1 IN ARRAY sub_categories LOOP
    INSERT INTO category(parent, short_name, name) VALUES (parent_id, category[1], category[2]);
  END LOOP;
END
$$;

SELECT add_category('Research fields', 'Research fields',
  ARRAY[
    ['Energy', 'Energy'],
    ['E&E', 'Earth and Environment'],
    ['Health', 'Health'],
    ['Information', 'Information'],
    ['AST', 'Aeronautics, Space and Transport'],
    ['Matter', 'Matter']
  ]
);

SELECT add_category('POF IV', 'Program-oriented Funding IV',
  ARRAY[
    ['Energy System Design', 'Energy System Design (Energy)'],
    ['Materials and Technologies for the Energy Transition', 'Materials and Technologies for the Energy Transition (Energy)'],
    ['Fusion', 'Fusion (Energy)'],
    ['Nuclear Waste Management, Safety, and Radiation Research', 'Nuclear Waste Management, Safety, and Radiation Research (Energy)'],
    ['Changing Earth – Sustaining our Future', 'Changing Earth – Sustaining our Future (Earth and Environment)'],
    ['Cancer Research', 'Cancer Research (Health)'],
    ['Environment-related and Metabolic Diseases', 'Environment-related and Metabolic Diseases (Health)'],
    ['Systemic Medicine and Cardiovascular Diseases', 'Systemic Medicine and Cardiovascular Diseases (Health)'],
    ['Infection Research', 'Infection Research (Health)'],
    ['Neurodegenerative Diseases', 'Neurodegenerative Diseases (Health)'],
    ['Engineering Digital Futures', 'Engineering Digital Futures (Information)'],
    ['Natural, Artificial, and Cognitive Information Processing', 'Natural, Artificial, and Cognitive Information Processing (Information)'],
    ['Materials Systems Engineering', 'Materials Systems Engineering (Information)'],
    ['Aeronautics', 'Aeronautics (Aeronautics, Space, and Transport)'],
    ['Space', 'Space (Aeronautics, Space, and Transport)'],
    ['Transport', 'Transport (Aeronautics, Space, and Transport)'],
    ['Matter and the Universe', 'Matter and the Universe (Matter)'],
    ['Matter and Technologies', 'Matter and Technologies (Matter)'],
    ['From Matter to Materials and Life', 'From Matter to Materials and Life (Matter)']
  ]
);


CREATE FUNCTION add_test_categories()
RETURNS TABLE (LIKE category)
LANGUAGE plpgsql
AS $$
  DECLARE parent1 uuid;
  DECLARE parent2 uuid;
  DECLARE parent3 uuid;
BEGIN
  INSERT INTO category(short_name, name) VALUES ('top level 1', 'Top Level Category 1') RETURNING id INTO parent1;
  --
  INSERT INTO category(parent, short_name, name) VALUES (parent1, 'category A', 'Category A aka 1.1') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 1 bit deeper', 'Category 1 aka 1.1.1') RETURNING id INTO parent3;
  --
  INSERT INTO category(parent, short_name, name) VALUES (parent3, 'category a bit deeper', 'Category a aka 1.1.1.1');
  INSERT INTO category(parent, short_name, name) VALUES (parent3, 'category b bit deeper', 'Category b aka 1.1.1.2');
  INSERT INTO category(parent, short_name, name) VALUES (parent3, 'category c bit deeper and longer', 'Category c aka 1.1.1.3');
  INSERT INTO category(parent, short_name, name) VALUES (parent3, 'category d bit deeper and longer', 'Category d aka 1.1.1.4');
  --
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 2', 'Category 2 aka 1.1.2') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 3', 'Category 3 aka 1.1.3') RETURNING id INTO parent3;
  --
  INSERT INTO category(parent, short_name, name) VALUES (parent1, 'category B', 'Category B aka 1.2') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 1', 'Category 1 aka 1.2.1') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 2', 'Category 2 aka 1.2.2') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 3', 'Category 3 aka 1.2.3') RETURNING id INTO parent3;
  --
  INSERT INTO category(short_name, name) VALUES ('top level 2 bit longer', 'Top Level Category 2') RETURNING id INTO parent1;
  --
  INSERT INTO category(parent, short_name, name) VALUES (parent1, 'category A bit longer', 'Category A aka 2.1') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 1 bit longer', 'Category 1 aka 2.1.1') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 2 bit longer', 'Category 2 aka 2.1.2') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 3 bit longer', 'Category 3 aka 2.1.3') RETURNING id INTO parent3;
  --
  INSERT INTO category(parent, short_name, name) VALUES (parent1, 'category B even more longer', 'Category B aka 2.2') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 1 even more longer', 'Category 1 aka 2.2.1') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 2 even more longer', 'Category 2 aka 2.2.2') RETURNING id INTO parent3;
  INSERT INTO category(parent, short_name, name) VALUES (parent2, 'category 3 even more longer', 'Category 3 aka 2.2.3') RETURNING id INTO parent3;
END
$$;

SELECT add_test_categories();
