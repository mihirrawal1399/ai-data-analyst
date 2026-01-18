import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Create demo user
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@system.local' },
        update: {},
        create: {
            email: 'demo@system.local',
            password: null,
            role: 'GUEST',
        },
    });

    console.log('Demo user created:', demoUser.id);

    // Create sample dataset
    const demoDataset = await prisma.dataset.upsert({
        where: { id: 'demo-dataset-001' },
        update: {},
        create: {
            id: 'demo-dataset-001',
            name: 'Sample E-Commerce Data',
            userId: demoUser.id,
        },
    });

    console.log('Demo dataset created:', demoDataset.id);

    // Create sample tables
    const ordersTable = await prisma.datasetTable.upsert({
        where: { id: 'demo-table-orders' },
        update: {},
        create: {
            id: 'demo-table-orders',
            name: 'orders',
            rowCount: 100,
            datasetId: demoDataset.id,
        },
    });

    const customersTable = await prisma.datasetTable.upsert({
        where: { id: 'demo-table-customers' },
        update: {},
        create: {
            id: 'demo-table-customers',
            name: 'customers',
            rowCount: 50,
            datasetId: demoDataset.id,
        },
    });

    console.log('Demo tables created');

    // Create sample columns for orders table
    const orderColumns = [
        { name: 'order_id', dataType: 'INTEGER' },
        { name: 'customer_id', dataType: 'INTEGER' },
        { name: 'order_date', dataType: 'DATE' },
        { name: 'total_amount', dataType: 'DECIMAL' },
        { name: 'status', dataType: 'VARCHAR' },
    ];

    for (const col of orderColumns) {
        await prisma.datasetColumn.upsert({
            where: { id: `demo-col-orders-${col.name}` },
            update: {},
            create: {
                id: `demo-col-orders-${col.name}`,
                name: col.name,
                dataType: col.dataType,
                isNullable: false,
                datasetId: demoDataset.id,
                tableId: ordersTable.id,
            },
        });
    }

    // Create sample columns for customers table
    const customerColumns = [
        { name: 'customer_id', dataType: 'INTEGER' },
        { name: 'name', dataType: 'VARCHAR' },
        { name: 'email', dataType: 'VARCHAR' },
        { name: 'signup_date', dataType: 'DATE' },
        { name: 'total_spent', dataType: 'DECIMAL' },
    ];

    for (const col of customerColumns) {
        await prisma.datasetColumn.upsert({
            where: { id: `demo-col-customers-${col.name}` },
            update: {},
            create: {
                id: `demo-col-customers-${col.name}`,
                name: col.name,
                dataType: col.dataType,
                isNullable: false,
                datasetId: demoDataset.id,
                tableId: customersTable.id,
            },
        });
    }

    console.log('Demo columns created');
    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
