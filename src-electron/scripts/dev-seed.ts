import { app } from 'electron';
import { getDataSource, initializeDatabase } from '../shared/database/database';
import { TableZoneEntity } from '../modules/table/entities/table-zone.entity';
import { TableEntity } from '../modules/table/entities/table.entity';
import { ProductFamilyEntity } from '../modules/product-family/entities/product-family.entity';
import { ProductEntity } from '../modules/product/entities/product.entity';
import { TableStatus } from '../modules/table/enums/table-status.enum';

export async function runDevSeed() {
  const dataSource = getDataSource();
  const zoneRepo = dataSource.getRepository(TableZoneEntity);
  const tableRepo = dataSource.getRepository(TableEntity);
  const familyRepo = dataSource.getRepository(ProductFamilyEntity);
  const productRepo = dataSource.getRepository(ProductEntity);

  const existingZones = await zoneRepo.count();
  if (existingZones > 0) {
    console.log('[Seed] Database already seeded. Skipping.');
    return;
  }

  console.log('[Seed] Seeding sample data...');

  // 1. Zones & Tables
  const terrace = await zoneRepo.save({ name: 'Terrasse' });
  const mainRoom = await zoneRepo.save({ name: 'Salle Principale' });
  const vipRoom = await zoneRepo.save({ name: 'Salle VIP' });
  const garden = await zoneRepo.save({ name: 'Jardin' });

  await tableRepo.save([
    // Terrasse
    { name: 'T1', zoneId: terrace.id, status: TableStatus.AVAILABLE },
    { name: 'T2', zoneId: terrace.id, status: TableStatus.AVAILABLE },
    { name: 'T3', zoneId: terrace.id, status: TableStatus.AVAILABLE },
    { name: 'T4', zoneId: terrace.id, status: TableStatus.AVAILABLE },
    { name: 'T5', zoneId: terrace.id, status: TableStatus.AVAILABLE },

    // Salle Principale
    { name: 'S1', zoneId: mainRoom.id, status: TableStatus.AVAILABLE },
    { name: 'S2', zoneId: mainRoom.id, status: TableStatus.AVAILABLE },
    { name: 'S3', zoneId: mainRoom.id, status: TableStatus.AVAILABLE },
    { name: 'S4', zoneId: mainRoom.id, status: TableStatus.AVAILABLE },
    { name: 'S5', zoneId: mainRoom.id, status: TableStatus.AVAILABLE },
    { name: 'S6', zoneId: mainRoom.id, status: TableStatus.AVAILABLE },

    // VIP
    { name: 'VIP1', zoneId: vipRoom.id, status: TableStatus.AVAILABLE },
    { name: 'VIP2', zoneId: vipRoom.id, status: TableStatus.AVAILABLE },
    { name: 'VIP3', zoneId: vipRoom.id, status: TableStatus.AVAILABLE },

    // Jardin
    { name: 'J1', zoneId: garden.id, status: TableStatus.AVAILABLE },
    { name: 'J2', zoneId: garden.id, status: TableStatus.AVAILABLE },
    { name: 'J3', zoneId: garden.id, status: TableStatus.AVAILABLE },
  ]);

  // Families
  const boissons = await familyRepo.save({
    name: 'Boissons',
    description: 'Softs et boissons fraîches',
  });

  const cafe = await familyRepo.save({
    name: 'Café & Thé',
    description: 'Boissons chaudes',
  });

  const entrees = await familyRepo.save({
    name: 'Entrées',
    description: 'Salades et entrées',
  });

  const plats = await familyRepo.save({
    name: 'Plats',
    description: 'Plats principaux',
  });

  const pizzas = await familyRepo.save({
    name: 'Pizzas',
    description: 'Pizzas maison',
  });

  const burgers = await familyRepo.save({
    name: 'Burgers',
    description: 'Burgers gourmets',
  });

  const sandwichs = await familyRepo.save({
    name: 'Sandwichs',
    description: 'Sandwichs et paninis',
  });

  const pates = await familyRepo.save({
    name: 'Pâtes',
    description: 'Spaghetti et penne',
  });

  const desserts = await familyRepo.save({
    name: 'Desserts',
    description: 'Desserts et pâtisseries',
  });

  const glaces = await familyRepo.save({
    name: 'Glaces',
    description: 'Crèmes glacées',
  });

  await productRepo.save(
    [
      // ========= BOISSONS =========
      { name: 'Coca Cola', price: 3.5, productFamilyId: boissons.id },
      { name: 'Coca Zero', price: 3.5, productFamilyId: boissons.id },
      { name: 'Fanta Orange', price: 3.5, productFamilyId: boissons.id },
      { name: 'Sprite', price: 3.5, productFamilyId: boissons.id },
      { name: 'Schweppes', price: 4, productFamilyId: boissons.id },
      { name: 'Eau Minérale', price: 2, productFamilyId: boissons.id },
      { name: 'Eau Gazeuse', price: 2.5, productFamilyId: boissons.id },
      { name: 'Red Bull', price: 7, productFamilyId: boissons.id },
      { name: 'Jus d’Orange', price: 4, productFamilyId: boissons.id },
      { name: 'Jus de Fraise', price: 4.5, productFamilyId: boissons.id },
      { name: 'Jus d’Ananas', price: 4.5, productFamilyId: boissons.id },
      { name: 'Citronnade', price: 4, productFamilyId: boissons.id },
      { name: 'Limonade Maison', price: 5, productFamilyId: boissons.id },
      { name: 'Milkshake Chocolat', price: 7, productFamilyId: boissons.id },
      { name: 'Milkshake Vanille', price: 7, productFamilyId: boissons.id },

      // ========= CAFE =========
      { name: 'Espresso', price: 2.5, productFamilyId: cafe.id },
      { name: 'Double Espresso', price: 4, productFamilyId: cafe.id },
      { name: 'Café Crème', price: 3.5, productFamilyId: cafe.id },
      { name: 'Cappuccino', price: 4, productFamilyId: cafe.id },
      { name: 'Latte Macchiato', price: 5, productFamilyId: cafe.id },
      { name: 'Americano', price: 3, productFamilyId: cafe.id },
      { name: 'Chocolat Chaud', price: 4.5, productFamilyId: cafe.id },
      { name: 'Thé Vert', price: 3, productFamilyId: cafe.id },
      { name: 'Thé à la Menthe', price: 3, productFamilyId: cafe.id },
      { name: 'Infusion Camomille', price: 3.5, productFamilyId: cafe.id },

      // ========= ENTREES =========
      { name: 'Salade César', price: 12, productFamilyId: entrees.id },
      { name: 'Salade Tunisienne', price: 10, productFamilyId: entrees.id },
      { name: 'Salade Méditerranéenne', price: 11, productFamilyId: entrees.id },
      { name: 'Brik au Thon', price: 6, productFamilyId: entrees.id },
      { name: 'Brik à l’Oeuf', price: 5, productFamilyId: entrees.id },
      { name: 'Soupe du Jour', price: 8, productFamilyId: entrees.id },
      { name: 'Carpaccio', price: 13, productFamilyId: entrees.id },

      // ========= PLATS =========
      { name: 'Steak Frites', price: 18, productFamilyId: plats.id },
      { name: 'Escalope Grillée', price: 16, productFamilyId: plats.id },
      { name: 'Escalope Panée', price: 16, productFamilyId: plats.id },
      { name: 'Poulet Grillé', price: 17, productFamilyId: plats.id },
      { name: 'Cordon Bleu', price: 18, productFamilyId: plats.id },
      { name: 'Filet de Boeuf', price: 24, productFamilyId: plats.id },
      { name: 'Entrecôte', price: 26, productFamilyId: plats.id },
      { name: 'Brochettes Mixte', price: 19, productFamilyId: plats.id },
      { name: 'Couscous Agneau', price: 20, productFamilyId: plats.id },
      { name: 'Ojja Merguez', price: 15, productFamilyId: plats.id },
      { name: 'Poisson Grillé', price: 22, productFamilyId: plats.id },
      { name: 'Saumon Grillé', price: 25, productFamilyId: plats.id },

      // ========= PIZZAS =========
      { name: 'Pizza Margarita', price: 11, productFamilyId: pizzas.id },
      { name: 'Pizza Thon', price: 13, productFamilyId: pizzas.id },
      { name: 'Pizza Pepperoni', price: 14, productFamilyId: pizzas.id },
      { name: 'Pizza 4 Fromages', price: 15, productFamilyId: pizzas.id },
      { name: 'Pizza Fruits de Mer', price: 18, productFamilyId: pizzas.id },
      { name: 'Pizza Poulet', price: 14, productFamilyId: pizzas.id },
      { name: 'Pizza Végétarienne', price: 13, productFamilyId: pizzas.id },
      { name: 'Pizza Reine', price: 15, productFamilyId: pizzas.id },
      { name: 'Pizza Napolitaine', price: 14, productFamilyId: pizzas.id },
      { name: 'Pizza Mexicaine', price: 15, productFamilyId: pizzas.id },

      // ========= BURGERS =========
      { name: 'Classic Burger', price: 13, productFamilyId: burgers.id },
      { name: 'Cheese Burger', price: 14, productFamilyId: burgers.id },
      { name: 'Double Burger', price: 18, productFamilyId: burgers.id },
      { name: 'Chicken Burger', price: 13, productFamilyId: burgers.id },
      { name: 'Bacon Burger', price: 17, productFamilyId: burgers.id },
      { name: 'BBQ Burger', price: 16, productFamilyId: burgers.id },
      { name: 'Mexican Burger', price: 16, productFamilyId: burgers.id },
      { name: 'Monster Burger', price: 20, productFamilyId: burgers.id },

      // ========= SANDWICHS =========
      { name: 'Panini Poulet', price: 10, productFamilyId: sandwichs.id },
      { name: 'Panini Thon', price: 10, productFamilyId: sandwichs.id },
      { name: 'Sandwich Escalope', price: 11, productFamilyId: sandwichs.id },
      { name: 'Sandwich Kebab', price: 12, productFamilyId: sandwichs.id },
      { name: 'Club Sandwich', price: 13, productFamilyId: sandwichs.id },
      { name: 'Tacos Poulet', price: 14, productFamilyId: sandwichs.id },
      { name: 'Tacos Viande', price: 15, productFamilyId: sandwichs.id },

      // ========= PATES =========
      { name: 'Spaghetti Bolognaise', price: 14, productFamilyId: pates.id },
      { name: 'Spaghetti Carbonara', price: 15, productFamilyId: pates.id },
      { name: 'Penne Arrabiata', price: 13, productFamilyId: pates.id },
      { name: 'Lasagnes Maison', price: 16, productFamilyId: pates.id },
      { name: 'Tagliatelles Saumon', price: 18, productFamilyId: pates.id },
      { name: 'Penne Poulet Champignons', price: 16, productFamilyId: pates.id },

      // ========= DESSERTS =========
      { name: 'Fondant Chocolat', price: 7, productFamilyId: desserts.id },
      { name: 'Cheesecake', price: 8, productFamilyId: desserts.id },
      { name: 'Tiramisu', price: 8, productFamilyId: desserts.id },
      { name: 'Crêpe Nutella', price: 6, productFamilyId: desserts.id },
      { name: 'Crêpe Banane Chocolat', price: 7, productFamilyId: desserts.id },
      { name: 'Brownie', price: 6, productFamilyId: desserts.id },
      { name: 'Millefeuille', price: 7, productFamilyId: desserts.id },
      { name: 'Mousse au Chocolat', price: 6, productFamilyId: desserts.id },
      { name: 'Tarte aux Pommes', price: 7, productFamilyId: desserts.id },
      { name: 'Panna Cotta', price: 8, productFamilyId: desserts.id },

      // ========= GLACES =========
      { name: 'Glace Vanille', price: 5, productFamilyId: glaces.id },
      { name: 'Glace Chocolat', price: 5, productFamilyId: glaces.id },
      { name: 'Glace Fraise', price: 5, productFamilyId: glaces.id },
      { name: 'Coupe Dame Blanche', price: 8, productFamilyId: glaces.id },
      { name: 'Banana Split', price: 9, productFamilyId: glaces.id },
      { name: 'Coupe Chocolat', price: 8, productFamilyId: glaces.id },
      { name: 'Coupe Fruits Rouges', price: 9, productFamilyId: glaces.id },
    ].map((product) => ({ ...product, description: `Description de ${product.name}` })),
  );
  console.log('[Seed] Seeding complete.');
}

// Support running as a standalone script
if (process.argv.some((arg) => arg.includes('dev-seed'))) {
  app.whenReady().then(async () => {
    try {
      await initializeDatabase();
      await runDevSeed();
      app.quit();
      process.exit(0);
    } catch (error) {
      console.error('[Seed] Error:', error);
      app.quit();
      process.exit(1);
    }
  });
}
