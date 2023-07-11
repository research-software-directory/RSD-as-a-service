-- THIS FILE SHOULD BE MOVED TO THE DEPLOMENT REPO AND USED AS A MIGRATION FILE

insert into category(id, parent, short_name, name)
values
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', null, 'Research fields', 'Research fields'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', null, 'POF IV', 'Program-oriented Funding IV')
  ;

insert into category(parent, short_name, name)
values
  -- Research fields
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', 'Energy', 'Energy'),
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', 'E&E', 'Earth and Environment'),
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', 'Health', 'Health'),
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', 'Information', 'Information'),
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', 'AST', 'Aeronautics, Space and Transport'),
  ('6b7569fb-b9d8-43f3-8ff0-5b8cbbae6540', 'Matter', 'Matter'),
  -- POV IV
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Energy System Design', 'Energy System Design (Energy)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Materials and Technologies for the Energy Transition', 'Materials and Technologies for the Energy Transition (Energy)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Fusion', 'Fusion (Energy)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Nuclear Waste Management, Safety, and Radiation Research', 'Nuclear Waste Management, Safety, and Radiation Research (Energy)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Changing Earth – Sustaining our Future', 'Changing Earth – Sustaining our Future (Earth and Environment)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Cancer Research', 'Cancer Research (Health)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Environment-related and Metabolic Diseases', 'Environment-related and Metabolic Diseases (Health)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Systemic Medicine and Cardiovascular Diseases', 'Systemic Medicine and Cardiovascular Diseases (Health)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Infection Research', 'Infection Research (Health)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Neurodegenerative Diseases', 'Neurodegenerative Diseases (Health)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Engineering Digital Futures', 'Engineering Digital Futures (Information)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Natural, Artificial, and Cognitive Information Processing', 'Natural, Artificial, and Cognitive Information Processing (Information)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Materials Systems Engineering', 'Materials Systems Engineering (Information)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Aeronautics', 'Aeronautics (Aeronautics, Space, and Transport)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Space', 'Space (Aeronautics, Space, and Transport)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Transport', 'Transport (Aeronautics, Space, and Transport)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Matter and the Universe', 'Matter and the Universe (Matter)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'Matter and Technologies', 'Matter and Technologies (Matter)'),
  ('93ff66a7-29fa-469f-af56-6ef09c4454f9', 'From Matter to Materials and Life', 'From Matter to Materials and Life (Matter)')
  ;
