import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');

    // 1. Seed Roles ມາດຕະຖານ
    const standardRoles = [
        { name: 'SUPERADMIN', description: 'ຜູ້ດູແລລະບົບສູງສຸດ (Super Administrator)' },
        { name: 'ADMIN', description: 'ຜູ້ດູແລລະບົບ (Administrator)' },
        { name: 'EDITOR', description: 'ຜູ້ຈັດການເນື້ອຫາ (Editor)' },
        { name: 'STAFF', description: 'ພະນັກງານທົ່ວໄປ (Staff)' },
    ];

    for (const r of standardRoles) {
        await prisma.role.upsert({
            where: { name: r.name },
            update: { description: r.description },
            create: { name: r.name, description: r.description },
        });
    }
    console.log('Seeded standard roles.');

    const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPERADMIN' } });

    // 2. ເຂົ້າລະຫັດລະຫັດຜ່ານ
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('EDL1234', saltRounds);

    // 3. ສ້າງ SuperAdmin User
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@edl.com.la' },
        update: {
            roleId: superAdminRole?.id,
        },
        create: {
            employeeCode: 'EDL-0001',
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@edl.com.la',
            passwordHash: passwordHash,
            roleId: superAdminRole?.id,
            status: 'ACTIVE',
        },
    });

    console.log('Created/Checked Super Admin User:', superAdmin.email);

    // 4. Seed Master Permissions ສຳລັບທຸກໆໂມດູນໃນລະບົບ (ລວມທັງ ROLES)
    const modules = [
        'DEPARTMENTS',
        'BRANCHES',
        'SERVICE_CENTERS',
        'PROVINCES',
        'DISTRICTS',
        'VILLAGES',
        'ORGANIZATION_STRUCTURES',
        'VISION_MISSIONS',
        'ELECTRICAL_KNOWLEDGE',
        'MAGAZINES',
        'NEWS_CATEGORIES',
        'NEWS',
        'NEWS_TAGS',
        'LEGISLATIONS',
        'ELECTRICITY_TARIFFS',
        'PROCUREMENTS',
        'POSITIONS',
        'JOB_POSTINGS',
        'USERS',
        'ROLES',
    ];

    const actions = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

    let seededCount = 0;
    for (const mod of modules) {
        for (const act of actions) {
            await prisma.permission.upsert({
                where: {
                    module_action: {
                        module: mod,
                        action: act,
                    },
                },
                update: {},
                create: {
                    module: mod,
                    action: act,
                },
            });
            seededCount++;
        }
    }

    console.log(`Seeded ${seededCount} permissions across ${modules.length} modules.`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
