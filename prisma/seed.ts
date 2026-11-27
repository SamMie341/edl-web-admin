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

    // 2. Seed Master Permissions ສຳລັບທຸກໆໂມດູນໃນລະບົບ (21 ໂມດູນ)
    const modules = [
        'CAROUSELS',
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
        'ELECTRICITY_CALCULATOR',
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
    const permMap = new Map<string, number>();
    for (const p of allPermissions) {
        permMap.set(`${p.module}:${p.action}`, p.id);
    }

    const assignRolePermissions = async (
        roleName: string,
        targetPerms: { module: string; action: string }[],
    ) => {
        const roleId = roleMap[roleName];
        if (!roleId) return;

        const permIds: number[] = [];
        for (const tp of targetPerms) {
            const id = permMap.get(`${tp.module}:${tp.action}`);
            if (id) permIds.push(id);
        }

        // Clean & Sync ເພື່ອໃຫ້ສິດກົງຕາມມາດຕະຖານ ລົບສິດທີ່ບໍ່ກ່ຽວຂ້ອງທີ່ອາດເຄີຍຕົກຄ້າງ
        await prisma.rolePermission.deleteMany({ where: { roleId } });
        await prisma.rolePermission.createMany({
            data: permIds.map((permissionId) => ({ roleId, permissionId })),
            skipDuplicates: true,
        });

        console.log(`==> [Prisma Seed] Assigned ${permIds.length} permissions to ${roleName}.`);
    };

    // 3.1 SUPERADMIN: ຜູ້ດູແລລະບົບສູງສຸດ - ໄດ້ສິດທັງໝົດ 100% (21 Modules × 4 Actions = 84 Permissions)
    const superAdminPerms = allPermissions.map((p) => ({ module: p.module, action: p.action }));
    await assignRolePermissions('SUPERADMIN', superAdminPerms);

    // 3.2 ADMIN: ຜູ້ດູແລລະບົບ (80 Permissions)
    // - ຈັດການຂໍ້ມູນທຸລະກິດ, ເນື້ອຫາ ແລະ ໂຄງສ້າງອົງກອນທັງໝົດ (19 Modules × 4 = 76 CRUD)
    // - ຈັດການບັນຊີຜູ້ໃຊ້ງານ: USERS:READ, USERS:CREATE, USERS:UPDATE (3 Permissions)
    // - ເບິ່ງລາຍການສິດທິບົດບາດ: ROLES:READ (1 Permission ສຳລັບສະແດງ Dropdown ເລືອກ Role ໃຫ້ User)
    // - ສະຫງວນ: USERS:DELETE, ROLES:CREATE, ROLES:UPDATE, ROLES:DELETE ໄວ້ໃຫ້ SUPERADMIN ເທົ່ານັ້ນ
    const adminPerms: { module: string; action: string }[] = [];
    for (const p of allPermissions) {
        if (p.module === 'ROLES') {
            if (p.action === 'READ') adminPerms.push({ module: p.module, action: p.action });
        } else if (p.module === 'USERS') {
            if (p.action !== 'DELETE') adminPerms.push({ module: p.module, action: p.action });
        } else {
            adminPerms.push({ module: p.module, action: p.action });
        }
    }
    await assignRolePermissions('ADMIN', adminPerms);

    // 3.3 EDITOR: ຜູ້ຈັດການເນື້ອຫາ / ບັນນາທິການ (55 Permissions)
    // - ຈັດການເນື້ອຫາ ແລະ ບໍລິການສາທາລະນະ (12 Content Modules × 4 Actions = 48 CRUD)
    // - ອ່ານຂໍ້ມູນອ້າງອີງອົງກອນ & ພູມສາດ (7 Reference Modules × READ = 7 Permissions)
    // - ບໍ່ມີສິດເຂົ້າເຖິງ: USERS ແລະ ROLES
    const editorContentModules = [
        'CAROUSELS',
        'NEWS',
        'NEWS_CATEGORIES',
        'NEWS_TAGS',
        'ELECTRICAL_KNOWLEDGE',
        'MAGAZINES',
        'ORGANIZATION_STRUCTURES',
        'VISION_MISSIONS',
        'LEGISLATIONS',
        'ELECTRICITY_TARIFFS',
        'ELECTRICITY_CALCULATOR',
        'PROCUREMENTS',
        'JOB_POSTINGS',
    ];
    const editorReferenceModules = [
        'DEPARTMENTS',
        'BRANCHES',
        'SERVICE_CENTERS',
        'PROVINCES',
        'DISTRICTS',
        'VILLAGES',
        'POSITIONS',
    ];
    const editorPerms: { module: string; action: string }[] = [];
    for (const p of allPermissions) {
        if (editorContentModules.includes(p.module)) {
            editorPerms.push({ module: p.module, action: p.action });
        } else if (editorReferenceModules.includes(p.module) && p.action === 'READ') {
            editorPerms.push({ module: p.module, action: p.action });
        }
    }
    await assignRolePermissions('EDITOR', editorPerms);

    // 3.4 STAFF: ພະນັກງານທົ່ວໄປ / Viewer (19 Permissions)
    // - ສິດອ່ານຢ່າງດຽວ (READ Only) ສຳລັບຂໍ້ມູນທົ່ວໄປ ແລະ ບໍລິການ (19 Modules × READ = 19 Permissions)
    // - ບໍ່ມີສິດຂຽນ/ແກ້ໄຂ/ລຶບ (CREATE, UPDATE, DELETE) ໃດໆ
    // - ບໍ່ມີສິດເຂົ້າເຖິງ: USERS ແລະ ROLES
    const staffPerms: { module: string; action: string }[] = [];
    for (const p of allPermissions) {
        if (p.module !== 'USERS' && p.module !== 'ROLES' && p.action === 'READ') {
            staffPerms.push({ module: p.module, action: p.action });
        }
    }
    await assignRolePermissions('STAFF', staffPerms);

    // 4. ສ້າງ/ອັບເດດ SuperAdmin User
    const saltRounds = 10;
    const superAdminEmail = 'admin@edl.com.la';
    const configuredSuperAdminPassword = process.env.SUPERADMIN_PASSWORD?.trim();
    const forceResetSuperAdmin = process.env.SUPERADMIN_RESET_PASSWORD === 'true';
    const existingSuperAdmin = await prisma.user.findUnique({
        where: { email: superAdminEmail },
    });

    const validateStrongPassword = (password: string) => {
        if (password.length < 6 || password === 'EDL1234') {
            throw new Error(
                'SUPERADMIN_PASSWORD must be at least 12 characters long and must not be the default weak password.',
            );
        }
    };

    let superAdmin;
    if (!existingSuperAdmin) {
        if (!configuredSuperAdminPassword) {
            throw new Error(
                'SUPERADMIN_PASSWORD is required in environment variables when creating the initial SuperAdmin user.',
            );
        }
        validateStrongPassword(configuredSuperAdminPassword);
        const passwordHash = await bcrypt.hash(configuredSuperAdminPassword, saltRounds);

        superAdmin = await prisma.user.create({
            data: {
                employeeCode: 'EDL-0001',
                firstName: 'Super',
                lastName: 'Admin',
                email: superAdminEmail,
                passwordHash,
                role: { connect: { id: roleMap['SUPERADMIN'] } },
                status: 'ACTIVE',
                mustChangePassword: false,
            },
        });
    } else {
        const updateData: {
            role: { connect: { id: number } };
            status: 'ACTIVE';
            passwordHash?: string;
            mustChangePassword?: boolean;
        } = {
            role: { connect: { id: roleMap['SUPERADMIN'] } },
            status: 'ACTIVE',
        };

        if (configuredSuperAdminPassword) {
            const hasLegacyDefaultPassword = await bcrypt.compare(
                'EDL1234',
                existingSuperAdmin.passwordHash,
            );
            if (forceResetSuperAdmin || hasLegacyDefaultPassword) {
                validateStrongPassword(configuredSuperAdminPassword);
                updateData.passwordHash = await bcrypt.hash(configuredSuperAdminPassword, saltRounds);
                updateData.mustChangePassword = false;
                console.log('==> [Prisma Seed] Rotated SuperAdmin password from SUPERADMIN_PASSWORD.');
            }
        }

        superAdmin = await prisma.user.update({
            where: { email: superAdminEmail },
            data: updateData,
        });
    }
    console.log(`==> [Prisma Seed] Created/Updated Super Admin User: ${superAdmin.email}`);

    // ============================================================================
    // 5. Seed Electricity Calculator Master Data (MOD-05)
    // ============================================================================
    console.log('==> [Prisma Seed] Seeding Electricity Calculator Master Data...');

    // 5.1 Clean up deprecated / unneeded seed data (saving templates, presets, appliance categories, 8-tier residential notice)
    await prisma.savingActionTemplate.deleteMany({});
    await prisma.appliancePreset.deleteMany({});
    await prisma.applianceCategory.deleteMany({});

    // Clean up old 8-tier residential notice and its schedules / tiers if they exist
    const oldResidentialNotice = await prisma.tariffNotice.findUnique({
        where: { noticeNumber: '1916/ຟຟລ.ຝທຜ' },
    });
    if (oldResidentialNotice) {
        await prisma.tariffSchedule.deleteMany({
            where: { noticeId: oldResidentialNotice.id },
        });
        await prisma.tariffNotice.delete({
            where: { id: oldResidentialNotice.id },
        });
    }

    // Clean up any old schedules / categories outside the 27 official notice categories
    await prisma.tariffSchedule.deleteMany({
        where: { categoryId: { gt: 27 } },
    });
    await prisma.tariffCategory.deleteMany({
        where: { id: { gt: 27 } },
    });

    // 5.2 Tariff Notice (Notice 2870/ຟຟລ.ຝທຜ - Q3 2026 Non-Residential)
    const nonResidentialNotice = await prisma.tariffNotice.upsert({
        where: { noticeNumber: '2870/ຟຟລ.ຝທຜ' },
        update: {
            title: 'ແຈ້ງການ ປັບປຸງລາຄາໄຟຟ້າພາກບໍ່ແມ່ນທີ່ຢູ່ອາໄສ ປະຈຳໄຕມາດ 03 ປີ 2026',
            issuedDate: new Date('2026-07-09'),
            effectiveFrom: new Date('2026-07-01'),
            effectiveTo: new Date('2026-09-30'),
            vatRate: 0.10,
            hotSeasonDiscountCapKwh: 0,
            maintenanceFeeKip: 10000,
            status: 'ACTIVE',
        },
        create: {
            noticeNumber: '2870/ຟຟລ.ຝທຜ',
            title: 'ແຈ້ງການ ປັບປຸງລາຄາໄຟຟ້າພາກບໍ່ແມ່ນທີ່ຢູ່ອາໄສ ປະຈຳໄຕມາດ 03 ປີ 2026',
            issuedDate: new Date('2026-07-09'),
            effectiveFrom: new Date('2026-07-01'),
            effectiveTo: new Date('2026-09-30'),
            vatRate: 0.10,
            hotSeasonDiscountCapKwh: 0,
            maintenanceFeeKip: 10000,
            status: 'ACTIVE',
        },
    });

    // 5.3 Tariff Categories (27 Official EDL Categories from Notice 2870 across 3 Voltage Levels)
    const tariffCategoriesData: Array<{
        id: number;
        nameLa: string;
        nameEn: string;
        categoryGroup: string;
        voltageLevel: string;
        description: string;
        orderIndex: number;
        flatRate: number;
    }> = [
            // ==========================================
            // 1. ແຮງດັນຕ່ຳ 0.4 kV (Low Voltage - 9 Categories)
            // ==========================================
            {
                id: 1,
                nameLa: 'ອົງການຈັດຕັ້ງສາກົນ',
                nameEn: 'International Organizations',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ສະຖານທູດ ແລະ ອົງການຈັດຕັ້ງສາກົນ ແຮງດັນຕ່ຳ 0.4 kV (2,632 ກີບ/kWh)',
                orderIndex: 1,
                flatRate: 2632,
            },
            {
                id: 2,
                nameLa: 'ທຸລະກິດທົ່ວໄປ, ໄຟຟ້າສຳຮອງ ແລະ ໄຟຟ້າຊົ່ວຄາວ',
                nameEn: 'General Business, Backup & Temporary Power',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ທຸລະກິດທົ່ວໄປ, ໄຟຟ້າສຳຮອງ ແລະ ໄຟຟ້າຊົ່ວຄາວ ແຮງດັນຕ່ຳ 0.4 kV (2,101 ກີບ/kWh)',
                orderIndex: 2,
                flatRate: 2101,
            },
            {
                id: 3,
                nameLa: 'ທຸລະກິດສຶກສາ',
                nameEn: 'Educational Business',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ທຸລະກິດສຶກສາ ແຮງດັນຕ່ຳ 0.4 kV (1,673 ກີບ/kWh)',
                orderIndex: 3,
                flatRate: 1673,
            },
            {
                id: 4,
                nameLa: 'ທຸລະກິດກິລາ',
                nameEn: 'Sports Business',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ທຸລະກິດກິລາ ແຮງດັນຕ່ຳ 0.4 kV (2,029 ກີບ/kWh)',
                orderIndex: 4,
                flatRate: 2029,
            },
            {
                id: 5,
                nameLa: 'ທຸລະກິດບັນເທີງ',
                nameEn: 'Entertainment Business',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ທຸລະກິດບັນເທີງ ແຮງດັນຕ່ຳ 0.4 kV (2,715 ກີບ/kWh)',
                orderIndex: 5,
                flatRate: 2715,
            },
            {
                id: 6,
                nameLa: 'ສຳນັກງານລັດບໍລິຫານ',
                nameEn: 'State Administrative Offices',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ສຳນັກງານລັດບໍລິຫານ ແຮງດັນຕ່ຳ 0.4 kV (1,711 ກີບ/kWh)',
                orderIndex: 6,
                flatRate: 1711,
            },
            {
                id: 7,
                nameLa: 'ຊົນລະປະທານ ແລະ ກະສິກຳແບບຄົວເຮືອນ',
                nameEn: 'Irrigation & Household Agriculture',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ຊົນລະປະທານ ແລະ ກະສິກຳແບບຄົວເຮືອນ ແຮງດັນຕ່ຳ 0.4 kV (1,465 ກີບ/kWh)',
                orderIndex: 7,
                flatRate: 1465,
            },
            {
                id: 8,
                nameLa: 'ທຸລະກິດກະສິກຳ ເພື່ອການຄ້າ',
                nameEn: 'Commercial Agriculture',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ທຸລະກິດກະສິກຳ ເພື່ອການຄ້າ ແຮງດັນຕ່ຳ 0.4 kV (1,826 ກີບ/kWh)',
                orderIndex: 8,
                flatRate: 1826,
            },
            {
                id: 9,
                nameLa: 'ອຸດສາຫະກຳປຸງແຕ່ງທົ່ວໄປ',
                nameEn: 'General Processing Industry',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '0.4 kV',
                description: 'ອຸດສາຫະກຳປຸງແຕ່ງທົ່ວໄປ ແຮງດັນຕ່ຳ 0.4 kV (1,921 ກີບ/kWh)',
                orderIndex: 9,
                flatRate: 1921,
            },

            // ==========================================
            // 2. ແຮງດັນກາງ 22 kV (Medium Voltage - 12 Categories)
            // ==========================================
            {
                id: 10,
                nameLa: 'ອົງການຈັດຕັ້ງສາກົນ',
                nameEn: 'International Organizations',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ສະຖານທູດ ແລະ ອົງການຈັດຕັ້ງສາກົນ ແຮງດັນກາງ 22 kV (2,347 ກີບ/kWh)',
                orderIndex: 10,
                flatRate: 2347,
            },
            {
                id: 11,
                nameLa: 'ທຸລະກິດທົ່ວໄປ, ໄຟຟ້າສຳຮອງ ແລະ ໄຟຟ້າຊົ່ວຄາວ',
                nameEn: 'General Business, Backup & Temporary Power',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ທຸລະກິດທົ່ວໄປ, ໄຟຟ້າສຳຮອງ ແລະ ໄຟຟ້າຊົ່ວຄາວ ແຮງດັນກາງ 22 kV (1,882 ກີບ/kWh)',
                orderIndex: 11,
                flatRate: 1882,
            },
            {
                id: 12,
                nameLa: 'ທຸລະກິດສຶກສາ',
                nameEn: 'Educational Business',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ທຸລະກິດສຶກສາ ແຮງດັນກາງ 22 kV (1,505 ກີບ/kWh)',
                orderIndex: 12,
                flatRate: 1505,
            },
            {
                id: 13,
                nameLa: 'ທຸລະກິດກິລາ',
                nameEn: 'Sports Business',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ທຸລະກິດກິລາ ແຮງດັນກາງ 22 kV (1,817 ກີບ/kWh)',
                orderIndex: 13,
                flatRate: 1817,
            },
            {
                id: 14,
                nameLa: 'ທຸລະກິດບັນເທີງ',
                nameEn: 'Entertainment Business',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ທຸລະກິດບັນເທີງ ແຮງດັນກາງ 22 kV (2,422 ກີບ/kWh)',
                orderIndex: 14,
                flatRate: 2422,
            },
            {
                id: 15,
                nameLa: 'ສຳນັກງານລັດບໍລິຫານ',
                nameEn: 'State Administrative Offices',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ສຳນັກງານລັດບໍລິຫານ ແຮງດັນກາງ 22 kV (1,539 ກີບ/kWh)',
                orderIndex: 15,
                flatRate: 1539,
            },
            {
                id: 16,
                nameLa: 'ຊົນລະປະທານ ແລະ ກະສິກຳແບບຄົວເຮືອນ',
                nameEn: 'Irrigation & Household Agriculture',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ຊົນລະປະທານ ແລະ ກະສິກຳແບບຄົວເຮືອນ ແຮງດັນກາງ 22 kV (1,375 ກີບ/kWh)',
                orderIndex: 16,
                flatRate: 1375,
            },
            {
                id: 17,
                nameLa: 'ທຸລະກິດກະສິກຳ ເພື່ອການຄ້າ',
                nameEn: 'Commercial Agriculture',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ທຸລະກິດກະສິກຳ ເພື່ອການຄ້າ ແຮງດັນກາງ 22 kV (1,785 ກີບ/kWh)',
                orderIndex: 17,
                flatRate: 1785,
            },
            {
                id: 18,
                nameLa: 'ອຸດສາຫະກຳຂຸດຄົ້ນ ແລະ ປຸງແຕ່ງແຮ່ທາດ',
                nameEn: 'Mining & Mineral Processing Industry',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ອຸດສາຫະກຳຂຸດຄົ້ນ ແລະ ປຸງແຕ່ງແຮ່ທາດ ແຮງດັນກາງ 22 kV (2,228 ກີບ/kWh)',
                orderIndex: 18,
                flatRate: 2228,
            },
            {
                id: 19,
                nameLa: 'ເຂດເສດຖະກິດພິເສດ',
                nameEn: 'Special Economic Zones (SEZ)',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ເຂດເສດຖະກິດພິເສດ ແຮງດັນກາງ 22 kV (2,133 ກີບ/kWh)',
                orderIndex: 19,
                flatRate: 2133,
            },
            {
                id: 20,
                nameLa: 'ອຸດສາຫະກຳປຸງແຕ່ງທົ່ວໄປ',
                nameEn: 'General Processing Industry',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ອຸດສາຫະກຳປຸງແຕ່ງທົ່ວໄປ ແຮງດັນກາງ 22 kV (1,840 ກີບ/kWh)',
                orderIndex: 20,
                flatRate: 1840,
            },
            {
                id: 21,
                nameLa: 'ນິຄົມອຸດສາຫະກຳ',
                nameEn: 'Industrial Estate / Industrial Zone',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '22 kV',
                description: 'ນິຄົມອຸດສາຫະກຳ ແຮງດັນກາງ 22 kV (1,722 ກີບ/kWh)',
                orderIndex: 21,
                flatRate: 1722,
            },

            // ==========================================
            // 3. ແຮງດັນສູງ 115 kV (High Voltage - 6 Categories)
            // ==========================================
            {
                id: 22,
                nameLa: 'ທຸລະກິດທົ່ວໄປ ແລະ ໄຟຟ້າຊົ່ວຄາວ',
                nameEn: 'General Business & Temporary Power',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '115 kV',
                description: 'ທຸລະກິດທົ່ວໄປ ແລະ ໄຟຟ້າຊົ່ວຄາວ ແຮງດັນສູງ 115 kV (1,801 ກີບ/kWh)',
                orderIndex: 22,
                flatRate: 1801,
            },
            {
                id: 23,
                nameLa: 'ອຸດສາຫະກຳຂຸດຄົ້ນ ແລະ ປຸງແຕ່ງແຮ່ທາດ',
                nameEn: 'Mining & Mineral Processing Industry',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '115 kV',
                description: 'ອຸດສາຫະກຳຂຸດຄົ້ນ ແລະ ປຸງແຕ່ງແຮ່ທາດ ແຮງດັນສູງ 115 kV (2,133 ກີບ/kWh)',
                orderIndex: 23,
                flatRate: 2133,
            },
            {
                id: 24,
                nameLa: 'ເຂດເສດຖະກິດພິເສດ',
                nameEn: 'Special Economic Zones (SEZ)',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '115 kV',
                description: 'ເຂດເສດຖະກິດພິເສດ ແຮງດັນສູງ 115 kV (2,045 ກີບ/kWh)',
                orderIndex: 24,
                flatRate: 2045,
            },
            {
                id: 25,
                nameLa: 'ອຸດສາຫະກຳປຸງແຕ່ງທົ່ວໄປ',
                nameEn: 'General Processing Industry',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '115 kV',
                description: 'ອຸດສາຫະກຳປຸງແຕ່ງທົ່ວໄປ ແຮງດັນສູງ 115 kV (1,792 ກີບ/kWh)',
                orderIndex: 25,
                flatRate: 1792,
            },
            {
                id: 26,
                nameLa: 'ນິຄົມອຸດສາຫະກຳ',
                nameEn: 'Industrial Estate / Industrial Zone',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '115 kV',
                description: 'ນິຄົມອຸດສາຫະກຳ ແຮງດັນສູງ 115 kV (1,680 ກີບ/kWh)',
                orderIndex: 26,
                flatRate: 1680,
            },
            {
                id: 27,
                nameLa: 'ທາງລົດໄຟຄວາມໄວສູງ',
                nameEn: 'High-Speed Railway',
                categoryGroup: 'NON_RESIDENTIAL',
                voltageLevel: '115 kV',
                description: 'ທາງລົດໄຟຄວາມໄວສູງ ແຮງດັນສູງ 115 kV (1,961 ກີບ/kWh)',
                orderIndex: 27,
                flatRate: 1961,
            },
        ];

    for (const tc of tariffCategoriesData) {
        await prisma.tariffCategory.upsert({
            where: { id: tc.id },
            update: {
                nameLa: tc.nameLa,
                nameEn: tc.nameEn,
                categoryGroup: tc.categoryGroup,
                voltageLevel: tc.voltageLevel,
                description: tc.description,
                orderIndex: tc.orderIndex,
                status: 'ACTIVE',
            },
            create: {
                id: tc.id,
                nameLa: tc.nameLa,
                nameEn: tc.nameEn,
                categoryGroup: tc.categoryGroup,
                voltageLevel: tc.voltageLevel,
                description: tc.description,
                orderIndex: tc.orderIndex,
                status: 'ACTIVE',
            },
        });
    }

    // 5.4 Seed Tariff Schedules for all 27 Non-Residential Categories (Notice 2870/ຟຟລ.ຝທຜ, Q3 & 2026)
    console.log('==> [Prisma Seed] Seeding non-residential flat-rate tariff schedules (27 categories)...');
    let scheduleCount = 0;
    for (const cat of tariffCategoriesData) {
        // Seed months 5-12 in 2026 (including Q3 months 7, 8, 9 from Notice 2870)
        for (let month = 5; month <= 12; month++) {
            const isHotSeason = month >= 3 && month <= 5;
            const schedule = await prisma.tariffSchedule.upsert({
                where: {
                    categoryId_year_month: { categoryId: cat.id, year: 2026, month },
                },
                update: {
                    noticeId: nonResidentialNotice.id,
                    isHotSeason,
                    maintenanceFeeKip: 10000,
                },
                create: {
                    noticeId: nonResidentialNotice.id,
                    categoryId: cat.id,
                    year: 2026,
                    month,
                    isHotSeason,
                    maintenanceFeeKip: 10000,
                },
            });

            await prisma.tariffTier.upsert({
                where: {
                    scheduleId_tierOrder: {
                        scheduleId: schedule.id,
                        tierOrder: 1,
                    },
                },
                update: {
                    label: 'ອັດຕາດຽວ (Flat Rate)',
                    minKwh: 0,
                    maxKwh: null,
                    rateKipPerKwh: cat.flatRate,
                },
                create: {
                    scheduleId: schedule.id,
                    tierOrder: 1,
                    label: 'ອັດຕາດຽວ (Flat Rate)',
                    minKwh: 0,
                    maxKwh: null,
                    rateKipPerKwh: cat.flatRate,
                },
            });
            scheduleCount++;
        }
    }

    // Reset sequence for tariff_categories so future inserts don't collide
    await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('tariff_categories', 'id'), coalesce(max(id), 1)) FROM tariff_categories;`
    );

    console.log(`==> [Prisma Seed] Seeded ${tariffCategoriesData.length} tariff categories and ${scheduleCount} monthly tariff schedules.`);

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
