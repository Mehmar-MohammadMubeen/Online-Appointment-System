export async function startDatabase(sequelizeInstance) {
  try {
    await sequelizeInstance.authenticate();
    console.log("Connection has been established successfully.");
    await sequelizeInstance.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    if (error.name === 'SequelizeConnectionError') {
      console.error("Unable to connect to the database:", error);
    } else {
      console.error("Error synchronizing models:", error);
    }
    throw new Error("Unable to start database:", error);
  }
}