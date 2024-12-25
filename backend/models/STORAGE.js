await queryInterface.addColumn("BLOG", "isDraft", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });