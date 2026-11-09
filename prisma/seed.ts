import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL is not defined in the environment variables.');
    process.exit(1);
}

const pool = new pg.Pool({ connectionString, idleTimeoutMillis: 5000, connectionTimeoutMillis: 10000 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('==> [Prisma Seed] Starting data seeding...');

    // 1. Seed Roles ມາດຕະຖານ (Standard Roles)
    const standardRoles = [
        { name: 'SUPERADMIN', description: 'ຜູ້ດູແລລະບົບສູງສຸດ (Super Administrator)' },
        { name: 'ADMIN', description: 'ຜູ້ດູແລລະບົບ (Administrator)' },
        { name: 'EDITOR', description: 'ຜູ້ຈັດການເນື້ອຫາ (Editor)' },
        { name: 'STAFF', description: 'ພະນັກງານທົ່ວໄປ (Staff)' },
    ];

    const roleMap: Record<string, number> = {};
    for (const r of standardRoles) {
        const role = await prisma.role.upsert({
            where: { name: r.name },
            update: { description: r.description },
            create: { name: r.name, description: r.description },
        });
        roleMap[r.name] = role.id;
    }
    console.log(`==> [Prisma Seed] Seeded standard roles: ${Object.keys(roleMap).join(', ')}`);

    // 2. Seed Master Permissions ສຳລັບທຸກໆໂມດູນໃນລະບົບ (20 ໂມດູນ)
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

    let seededPermCount = 0;
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
            seededPermCount++;
        }
    }
    console.log(`==> [Prisma Seed] Seeded ${seededPermCount} master permissions across ${modules.length} modules.`);

    // 3. ກຳນົດ Permissions ໃຫ້ແຕ່ລະ Role (RolePermission)
    const allPermissions = await prisma.permission.findMany();

    // 3.1 SUPERADMIN: ໄດ້ສິດທັງໝົດ 100%
    if (roleMap['SUPERADMIN']) {
        for (const p of allPermissions) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: roleMap['SUPERADMIN'],
                        permissionId: p.id,
                    },
                },
                update: {},
                create: {
                    roleId: roleMap['SUPERADMIN'],
                    permissionId: p.id,
                },
            });
        }
        console.log(`==> [Prisma Seed] Assigned all ${allPermissions.length} permissions to SUPERADMIN.`);
    }

    // 3.2 ADMIN: ໄດ້ສິດທັງໝົດ
    if (roleMap['ADMIN']) {
        for (const p of allPermissions) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: roleMap['ADMIN'],
                        permissionId: p.id,
                    },
                },
                update: {},
                create: {
                    roleId: roleMap['ADMIN'],
                    permissionId: p.id,
                },
            });
        }
        console.log(`==> [Prisma Seed] Assigned all ${allPermissions.length} permissions to ADMIN.`);
    }

    // 3.3 EDITOR: ໄດ້ສິດຈັດການເນື້ອຫາ (Content Modules: CRUD) ແລະ READ ໂມດູນອື່ນໆ
    if (roleMap['EDITOR']) {
        const editorContentModules = [
            'NEWS',
            'NEWS_CATEGORIES',
            'NEWS_TAGS',
            'ELECTRICAL_KNOWLEDGE',
            'MAGAZINES',
            'LEGISLATIONS',
            'PROCUREMENTS',
            'JOB_POSTINGS',
            'ORGANIZATION_STRUCTURES',
            'VISION_MISSIONS',
            'ELECTRICITY_TARIFFS',
        ];

        let editorPermCount = 0;
        for (const p of allPermissions) {
            const isContentModule = editorContentModules.includes(p.module);
            const isReadAction = p.action === 'READ';

            if (isContentModule || isReadAction) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: roleMap['EDITOR'],
                            permissionId: p.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: roleMap['EDITOR'],
                        permissionId: p.id,
                    },
                });
                editorPermCount++;
            }
        }
        console.log(`==> [Prisma Seed] Assigned ${editorPermCount} permissions to EDITOR.`);
    }

    // 3.4 STAFF: ໄດ້ສິດ READ ທຸກໆໂມດູນ
    if (roleMap['STAFF']) {
        let staffPermCount = 0;
        for (const p of allPermissions) {
            if (p.action === 'READ') {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: roleMap['STAFF'],
                            permissionId: p.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: roleMap['STAFF'],
                        permissionId: p.id,
                    },
                });
                staffPermCount++;
            }
        }
        console.log(`==> [Prisma Seed] Assigned ${staffPermCount} permissions to STAFF.`);
    }

    // 4. ສ້າງ/ອັບເດດ SuperAdmin User
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('EDL1234', saltRounds);

    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@edl.com.la' },
        update: {
            roleId: roleMap['SUPERADMIN'],
            status: 'ACTIVE',
        },
        create: {
            employeeCode: 'EDL-0001',
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@edl.com.la',
            passwordHash: passwordHash,
            roleId: roleMap['SUPERADMIN'],
            status: 'ACTIVE',
        },
    });
    console.log(`==> [Prisma Seed] Created/Updated Super Admin User: ${superAdmin.email}`);

    console.log('==> [Prisma Seed] Seeding finished successfully.');
}

main()
    .catch((e: any) => {
        console.error('==> [Prisma Seed] Error during seeding:', e);
        if (e.code === 'P2021') {
            console.error('\n⚠️ HINT: The required database tables do not exist yet.');
            console.error('Please run database migrations first using:\n  npx prisma migrate deploy\n');
        }
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
