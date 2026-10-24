const { AppDataSource } = require("../data-source");
const { seedStoreInformation } = require("./data-seed");

async function runSeed() {
  try {
    await AppDataSource.initialize();

    await seedStoreInformation(AppDataSource);

    console.log("Store information seed completed.");
  } catch (err) {
    console.error("Error seeding store information:", err);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

runSeed();
