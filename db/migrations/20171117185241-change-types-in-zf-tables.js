'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`ALTER TABLE public.zf_services DROP CONSTRAINT zf_services_pkey;
      ALTER TABLE public.zf_services ALTER COLUMN id TYPE VARCHAR(30) USING id::VARCHAR(30);
      ALTER TABLE public.zf_services ADD CONSTRAINT zf_services_pkey PRIMARY KEY (studioid, id);
      ALTER TABLE public.zf_customers DROP CONSTRAINT zf_customers_pkey;
      ALTER TABLE public.zf_customers ALTER COLUMN id TYPE VARCHAR(30) USING id::VARCHAR(30);
      ALTER TABLE public.zf_customers ADD CONSTRAINT zf_customers_pkey PRIMARY KEY (studioid, id);`)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`ALTER TABLE public.zf_services DROP CONSTRAINT zf_services_pkey;
      ALTER TABLE public.zf_services ALTER COLUMN id TYPE INTEGER USING id::INTEGER;
      ALTER TABLE public.zf_services ADD CONSTRAINT zf_services_pkey PRIMARY KEY (studioid, id);
      ALTER TABLE public.zf_customers DROP CONSTRAINT zf_customers_pkey;
      ALTER TABLE public.zf_customers ALTER COLUMN id TYPE INTEGER USING id::INTEGER;
      ALTER TABLE public.zf_customers ADD CONSTRAINT zf_customers_pkey PRIMARY KEY (studioid, id);`)
  }
};
