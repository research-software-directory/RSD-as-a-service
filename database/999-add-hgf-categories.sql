-- SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: Apache-2.0

-- THIS FILE SHOULD BE MOVED TO THE DEPLOMENT REPO AND USED AS A MIGRATION FILE

CREATE FUNCTION add_hgf_categories()
RETURNS TABLE (LIKE category)
LANGUAGE plpgsql
AS $$
  DECLARE parent uuid;
BEGIN
  INSERT INTO category(short_name, name, icon) VALUES
    ('Research fields', 'Research fields', '')
    RETURNING id INTO parent;

  INSERT INTO category(parent, short_name, name) VALUES
    (parent, 'Energy', 'Energy'),
    (parent, 'E&E', 'Earth and Environment'),
    (parent, 'Health', 'Health'),
    (parent, 'Information', 'Information'),
    (parent, 'AST', 'Aeronautics, Space and Transport'),
    (parent, 'Matter', 'Matter');

  INSERT INTO category(short_name, name, icon) VALUES
    ('POF IV', 'Program-oriented Funding IV', '')
    RETURNING id INTO parent;

  INSERT INTO category(parent, short_name, name) VALUES
    (parent, 'Energy System Design', 'Energy System Design (Energy)'),
    (parent, 'Materials and Technologies for the Energy Transition', 'Materials and Technologies for the Energy Transition (Energy)'),
    (parent, 'Fusion', 'Fusion (Energy)'),
    (parent, 'Nuclear Waste Management, Safety, and Radiation Research', 'Nuclear Waste Management, Safety, and Radiation Research (Energy)'),
    (parent, 'Changing Earth – Sustaining our Future', 'Changing Earth – Sustaining our Future (Earth and Environment)'),
    (parent, 'Cancer Research', 'Cancer Research (Health)'),
    (parent, 'Environment-related and Metabolic Diseases', 'Environment-related and Metabolic Diseases (Health)'),
    (parent, 'Systemic Medicine and Cardiovascular Diseases', 'Systemic Medicine and Cardiovascular Diseases (Health)'),
    (parent, 'Infection Research', 'Infection Research (Health)'),
    (parent, 'Neurodegenerative Diseases', 'Neurodegenerative Diseases (Health)'),
    (parent, 'Engineering Digital Futures', 'Engineering Digital Futures (Information)'),
    (parent, 'Natural, Artificial, and Cognitive Information Processing', 'Natural, Artificial, and Cognitive Information Processing (Information)'),
    (parent, 'Materials Systems Engineering', 'Materials Systems Engineering (Information)'),
    (parent, 'Aeronautics', 'Aeronautics (Aeronautics, Space, and Transport)'),
    (parent, 'Space', 'Space (Aeronautics, Space, and Transport)'),
    (parent, 'Transport', 'Transport (Aeronautics, Space, and Transport)'),
    (parent, 'Matter and the Universe', 'Matter and the Universe (Matter)'),
    (parent, 'Matter and Technologies', 'Matter and Technologies (Matter)'),
    (parent, 'From Matter to Materials and Life', 'From Matter to Materials and Life (Matter)');
END
$$;

SELECT add_hgf_categories();


CREATE FUNCTION add_test_categories()
RETURNS TABLE (LIKE category)
LANGUAGE plpgsql
AS $$
  DECLARE parent1 uuid;
  DECLARE parent2 uuid;
  DECLARE parent3 uuid;
BEGIN
  INSERT INTO category(short_name, name) VALUES
    ('top level 1', 'Top Level Category 1') RETURNING id INTO parent1;
  --
  INSERT INTO category(parent, short_name, name) VALUES
    (parent1, 'category A', 'Category A aka 1.1') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES
    (parent2, 'category 1 bit deeper', 'Category 1 aka 1.1.1') RETURNING id INTO parent3;
  --
  INSERT INTO category(parent, short_name, name) VALUES
    (parent2, 'category 2', 'Category 2 aka 1.1.2'),
    (parent2, 'category 3', 'Category 3 aka 1.1.3'),
    --
    (parent3, 'category a bit deeper', 'Category a aka 1.1.1.1'),
    (parent3, 'category b bit deeper', 'Category b aka 1.1.1.2'),
    (parent3, 'category c bit deeper and longer', 'Category c aka 1.1.1.3'),
    (parent3, 'category d bit deeper and longer', 'Category d aka 1.1.1.4');
  --
  INSERT INTO category(parent, short_name, name) VALUES
    (parent1, 'category B', 'Category B aka 1.2') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES
    (parent2, 'category 1', 'Category 1 aka 1.2.1'),
    (parent2, 'category 2', 'Category 2 aka 1.2.2'),
    (parent2, 'category 3', 'Category 3 aka 1.2.3');
  --
  INSERT INTO category(short_name, name) VALUES
    ('top level 2 bit longer', 'Top Level Category 2') RETURNING id INTO parent1;
  --
  INSERT INTO category(parent, short_name, name) VALUES
    (parent1, 'category A bit longer', 'Category A aka 2.1') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES
    (parent2, 'category 1 bit longer', 'Category 1 aka 2.1.1'),
    (parent2, 'category 2 bit longer', 'Category 2 aka 2.1.2'),
    (parent2, 'category 3 bit longer', 'Category 3 aka 2.1.3');
  --
  INSERT INTO category(parent, short_name, name) VALUES
    (parent1, 'category B even more longer', 'Category B aka 2.2') RETURNING id INTO parent2;
  INSERT INTO category(parent, short_name, name) VALUES
    (parent2, 'category 1 even more longer', 'Category 1 aka 2.2.1'),
    (parent2, 'category 2 even more longer', 'Category 2 aka 2.2.2'),
    (parent2, 'category 3 even more longer', 'Category 3 aka 2.2.3');
END
$$;

SELECT add_test_categories();
