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

/**
 * ຮັບປະກັນວ່າຕາຕະລາງພື້ນຖານທີ່ຈຳເປັນ (roles, permissions, role_permissions, users.role_id)
 * ມີຢູ່ແລ້ວໃນຖານຂໍ້ມູນ ກ່ອນທີ່ Prisma Client ຈະດຳເນີນການ Seed.
 * ວິທີນີ້ປ້ອງກັນຂໍ້ຜິດພາດ P2021 (Table does not exist) ເຖິງແມ່ນວ່າຍັງບໍ່ໄດ້ run migration ກໍຕາມ.
 */
async function ensureDatabaseSchema() {
    console.log('Checking and preparing database schema...');
    const ddl = `
        CREATE TABLE IF NOT EXISTS "roles" (
            "id" SERIAL NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "roles_name_key" ON "roles"("name");

        CREATE TABLE IF NOT EXISTS "permissions" (
            "id" SERIAL NOT NULL,
            "module" TEXT NOT NULL,
            "action" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "permissions_module_action_key" ON "permissions"("module", "action");

        CREATE TABLE IF NOT EXISTS "role_permissions" (
            "role_id" INTEGER NOT NULL,
            "permission_id" INTEGER NOT NULL,
            CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id")
        );

        CREATE TABLE IF NOT EXISTS "user_permissions" (
            "user_id" INTEGER NOT NULL,
            "permission_id" INTEGER NOT NULL,
            CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("user_id", "permission_id")
        );

        ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role_id" INTEGER;

        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'role_permissions_role_id_fkey') THEN 
                ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'role_permissions_permission_id_fkey') THEN 
                ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_permissions_user_id_fkey') THEN 
                ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_permissions_permission_id_fkey') THEN 
                ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_id_fkey') THEN 
                ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
            END IF;
        END $$;
    `;
    await pool.query(ddl);
    console.log('Database schema verified.');
}

async function main() {
    console.log('Start seeding...');

    // 0. ກວດສອບ ແລະ ສ້າງຕາຕະລາງທີ່ຈຳເປັນອັດຕະໂນມັດຖ້າຍັງບໍ່ມີ
    await ensureDatabaseSchema();

    // 1. Seed Roles ມາດຕະຖານ
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
    console.log('Seeded standard roles:', Object.keys(roleMap).join(', '));

    // 2. Seed Master Permissions ສຳລັບທຸກໆໂມດູນໃນລະບົບ (ລວມ 20 ໂມດູນ)
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
    console.log(`Seeded ${seededCount} master permissions across ${modules.length} modules.`);

    // 3. ດຶງ Permissions ທັງໝົດມາກຳນົດໃຫ້ Roles (RolePermission)
    const allPermissions = await prisma.permission.findMany();
    const permMap: Record<string, number> = {};
    for (const p of allPermissions) {
        permMap[`${p.module}:${p.action}`] = p.id;
    }

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
        console.log(`Assigned all ${allPermissions.length} permissions to SUPERADMIN.`);
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
        console.log(`Assigned all ${allPermissions.length} permissions to ADMIN.`);
    }

    // 3.3 EDITOR: ໄດ້ສິດຈັດການເນື້ອຫາ (Content Modules: CREATE, READ, UPDATE, DELETE) ແລະ READ ໂມດູນອື່ນໆ
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
        console.log(`Assigned ${editorPermCount} permissions to EDITOR.`);
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
        console.log(`Assigned ${staffPermCount} permissions to STAFF.`);
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
    console.log('Created/Updated Super Admin User:', superAdmin.email);

    // 5. ຖ້າມີ users ເດີມທີ່ຍັງບໍ່ມີ role_id ໃຫ້ sync ກັບ Roles ຕາມ default
    try {
        await pool.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'users' AND column_name = 'role'
                ) THEN
                    UPDATE "users" u
                    SET "role_id" = r."id"
                    FROM "roles" r
                    WHERE u."role"::text = r."name"
                      AND u."role_id" IS NULL;
                END IF;
            END $$;
        `);
    } catch {
        // Ignore if column 'role' does not exist
    }

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
