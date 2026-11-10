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

    // ============================================================================
    // 5. Seed Electricity Calculator Master Data (MOD-05)
    // ============================================================================
    console.log('==> [Prisma Seed] Seeding Electricity Calculator Master Data...');

    // 5.1 Appliance Categories
    const categoriesData = [
        { code: 'ac', nameLa: 'ເຄື່ອງປັບອາກາດ (ແອ)', nameEn: 'Air Conditioner', iconName: 'Snowflake', orderIndex: 1 },
        { code: 'fridge', nameLa: 'ຕູ້ເຢັນ / ຕູ້ແຊ່', nameEn: 'Refrigerator & Freezer', iconName: 'Refrigerator', orderIndex: 2 },
        { code: 'fan', nameLa: 'ພັດລົມ', nameEn: 'Electric Fan', iconName: 'Fan', orderIndex: 3 },
        { code: 'led', nameLa: 'ດອກໄຟ LED', nameEn: 'LED Light Bulb', iconName: 'Lightbulb', orderIndex: 4 },
        { code: 'oldlight', nameLa: 'ດອກໄຟນີອອນ / ດອກໄຟຮຸ່ນເກົ່າ', nameEn: 'Fluorescent / Incandescent Bulb', iconName: 'Lamp', orderIndex: 5 },
        { code: 'heater', nameLa: 'ເຄື່ອງທຳນ້ຳອຸ່ນ / ກາต้มນ້ຳຮ້ອນ', nameEn: 'Water Heater & Kettle', iconName: 'Flame', orderIndex: 6 },
        { code: 'kitchen', nameLa: 'ເຄື່ອງໃຊ້ໄຟຟ້າໃນຄົວເຮືອນ', nameEn: 'Kitchen Appliances', iconName: 'Utensils', orderIndex: 7 },
        { code: 'laundry', nameLa: 'ຈັກຊັກຜ້າ / ເຕົາລີດ', nameEn: 'Laundry & Ironing', iconName: 'Shirt', orderIndex: 8 },
        { code: 'entertainment', nameLa: 'ໂທລະທັດ / ຄອມພິວເຕີ', nameEn: 'TV & Electronics', iconName: 'Tv', orderIndex: 9 },
        { code: 'standby', nameLa: 'ສຽບປັກໄຟຖິ້ມໄວ້ (Standby)', nameEn: 'Standby Power', iconName: 'Plug', orderIndex: 10 },
    ];

    const categoryMap: Record<string, number> = {};
    for (const c of categoriesData) {
        const cat = await prisma.applianceCategory.upsert({
            where: { code: c.code },
            update: {
                nameLa: c.nameLa,
                nameEn: c.nameEn,
                iconName: c.iconName,
                orderIndex: c.orderIndex,
                status: 'ACTIVE',
            },
            create: {
                code: c.code,
                nameLa: c.nameLa,
                nameEn: c.nameEn,
                iconName: c.iconName,
                orderIndex: c.orderIndex,
                status: 'ACTIVE',
            },
        });
        categoryMap[c.code] = cat.id;
    }

    // 5.2 Appliance Presets
    const presetsData = [
        { categoryCode: 'ac', code: 'ac9', nameLa: 'ແອ 9,000 BTU', nameEn: 'Air Conditioner 9,000 BTU', defaultWatt: 800, defaultQuantity: 1, defaultHoursPerDay: 8.0, defaultDaysPerMonth: 30, isSampleDefault: false, orderIndex: 1 },
        { categoryCode: 'ac', code: 'ac12', nameLa: 'ແອ 12,000 BTU', nameEn: 'Air Conditioner 12,000 BTU', defaultWatt: 1100, defaultQuantity: 1, defaultHoursPerDay: 8.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 2 },
        { categoryCode: 'ac', code: 'ac18', nameLa: 'ແອ 18,000 BTU', nameEn: 'Air Conditioner 18,000 BTU', defaultWatt: 1600, defaultQuantity: 1, defaultHoursPerDay: 8.0, defaultDaysPerMonth: 30, isSampleDefault: false, orderIndex: 3 },
        { categoryCode: 'fridge', code: 'fridge', nameLa: 'ຕູ້ເຢັນ 1–2 ປະຕູ (ເຮັດວຽກຕະຫຼອດ)', nameEn: 'Refrigerator (Effective Load)', defaultWatt: 120, defaultQuantity: 1, defaultHoursPerDay: 12.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 4 },
        { categoryCode: 'fan', code: 'fan16', nameLa: 'ພັດລົມຕັ້ງພື້ນ / ຕັ້ງໂຕະ 16 ນິ້ວ', nameEn: '16-inch Electric Fan', defaultWatt: 50, defaultQuantity: 2, defaultHoursPerDay: 8.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 5 },
        { categoryCode: 'led', code: 'led9', nameLa: 'ດອກໄຟ LED 9W', nameEn: 'LED Bulb 9W', defaultWatt: 9, defaultQuantity: 5, defaultHoursPerDay: 6.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 6 },
        { categoryCode: 'oldlight', code: 'oldlight36', nameLa: 'ດອກໄຟນີອອນຍາວ 36W (ຮຸ່ນເກົ່າ)', nameEn: 'Fluorescent Tube 36W', defaultWatt: 36, defaultQuantity: 4, defaultHoursPerDay: 6.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 7 },
        { categoryCode: 'heater', code: 'heater3500', nameLa: 'ເຄື່ອງທຳນ້ຳອຸ່ນ 3,500W', nameEn: 'Water Heater 3,500W', defaultWatt: 3500, defaultQuantity: 1, defaultHoursPerDay: 0.5, defaultDaysPerMonth: 30, isSampleDefault: false, orderIndex: 8 },
        { categoryCode: 'kitchen', code: 'ricecooker', nameLa: 'ໝໍ້ຫຸງເຂົ້າໄຟຟ້າ', nameEn: 'Electric Rice Cooker', defaultWatt: 700, defaultQuantity: 1, defaultHoursPerDay: 1.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 9 },
        { categoryCode: 'laundry', code: 'iron', nameLa: 'ເຕົາລີດໄຟຟ້າ', nameEn: 'Electric Iron', defaultWatt: 1200, defaultQuantity: 1, defaultHoursPerDay: 0.5, defaultDaysPerMonth: 15, isSampleDefault: false, orderIndex: 10 },
        { categoryCode: 'entertainment', code: 'tv_led', nameLa: 'ໂທລະທັດ LED TV 43–55 ນິ້ວ', nameEn: 'LED TV 43-55 inch', defaultWatt: 100, defaultQuantity: 1, defaultHoursPerDay: 5.0, defaultDaysPerMonth: 30, isSampleDefault: true, orderIndex: 11 },
        { categoryCode: 'standby', code: 'standby_plug', nameLa: 'ສຽບປັກໄຟຄ້າງໄວ້ (Standby ລວມ)', nameEn: 'Standby Power (Chargers/TV/Appliances)', defaultWatt: 15, defaultQuantity: 1, defaultHoursPerDay: 24.0, defaultDaysPerMonth: 30, isSampleDefault: false, orderIndex: 12 },
    ];

    for (const p of presetsData) {
        const categoryId = categoryMap[p.categoryCode];
        if (!categoryId) continue;

        await prisma.appliancePreset.upsert({
            where: { code: p.code },
            update: {
                categoryId,
                nameLa: p.nameLa,
                nameEn: p.nameEn,
                defaultWatt: p.defaultWatt,
                defaultQuantity: p.defaultQuantity,
                defaultHoursPerDay: p.defaultHoursPerDay,
                defaultDaysPerMonth: p.defaultDaysPerMonth,
                isSampleDefault: p.isSampleDefault,
                orderIndex: p.orderIndex,
                status: 'ACTIVE',
            },
            create: {
                categoryId,
                code: p.code,
                nameLa: p.nameLa,
                nameEn: p.nameEn,
                defaultWatt: p.defaultWatt,
                defaultQuantity: p.defaultQuantity,
                defaultHoursPerDay: p.defaultHoursPerDay,
                defaultDaysPerMonth: p.defaultDaysPerMonth,
                isSampleDefault: p.isSampleDefault,
                orderIndex: p.orderIndex,
                status: 'ACTIVE',
            },
        });
    }

    // 5.3 Saving Action Templates
    const savingTemplatesData = [
        {
            categoryCode: 'ac',
            code: 'ac26',
            titleLa: 'ປັບອຸນຫະພູມແອເປັນ 26–27°C ພ້ອມເປີດພັດລົມຊ່ວຍ',
            titleEn: 'Set AC to 26–27°C and use a fan',
            descriptionLa: 'ການປັບອຸນຫະພູມແອຂຶ້ນທຸກໆ 1 ອົງສາ ຊ່ວຍປະຢັດໄຟໄດ້ປະມານ 10–15%',
            descriptionEn: 'Increasing AC temperature by 1-2°C reduces compressor workload by ~15%',
            effortLevel: 'EASY' as const,
            ruleType: 'FIXED_FRACTION' as const,
            fixedFraction: 0.15,
            reduceHoursBy: null,
            targetWattLow: null,
            targetWattHigh: null,
            defaultSelected: true,
            orderIndex: 1,
        },
        {
            categoryCode: 'ac',
            code: 'actimer',
            titleLa: 'ຕັ້ງເວລາປິດແອໄວຂຶ້ນ 1 ຊົ່ວໂມງກ່ອນຕື່ນນອນ',
            titleEn: 'Turn off AC 1 hour earlier using timer',
            descriptionLa: 'ຄວາມເຢັນຍັງຄົງຢູ່ໃນຫ້ອງອີກ 30–60 ນາທີຫຼັງປິດແອ ຊ່ວຍຫຼຸດຊົ່ວໂມງເຮັດວຽກລົງ 1 ຊມ./ມື້',
            descriptionEn: 'Room stays cool for 30-60 mins after turning off AC',
            effortLevel: 'EASY' as const,
            ruleType: 'REDUCE_HOURS' as const,
            fixedFraction: null,
            reduceHoursBy: 1.0,
            targetWattLow: null,
            targetWattHigh: null,
            defaultSelected: true,
            orderIndex: 2,
        },
        {
            categoryCode: 'ac',
            code: 'acclean',
            titleLa: 'ລ້າງແຜ່ນກອງອາກາດ ແລະ ລ້າງແອທຸກໆ 6 ເດືອນ',
            titleEn: 'Clean AC filters and coils every 6 months',
            descriptionLa: 'ຊ່ວຍໃຫ້ແອລະບາຍຄວາມເຢັນได้ดีຂຶ້ນ ປະຢັດໄຟລົງປະມານ 10%',
            descriptionEn: 'Improves airflow and cooling efficiency by ~10%',
            effortLevel: 'LOW_COST' as const,
            ruleType: 'FIXED_FRACTION' as const,
            fixedFraction: 0.10,
            reduceHoursBy: null,
            targetWattLow: null,
            targetWattHigh: null,
            defaultSelected: false,
            orderIndex: 3,
        },
        {
            categoryCode: 'oldlight',
            code: 'toled',
            titleLa: 'ປ່ຽນດອກໄຟຮຸ່ນເກົ່າເປັນດອກໄຟ LED ປະຢັດໄຟ (9W–16W)',
            titleEn: 'Replace old bulbs with LED (9W–16W)',
            descriptionLa: 'ດອກໄຟ LED ໃຫ້ຄວາມສະຫວ່າງເທົ່າກັນ ແຕ່ກິນໄຟໜ້ອຍກວ່າ 50–75%',
            descriptionEn: 'LED bulbs consume 50-75% less wattage for the same brightness',
            effortLevel: 'LOW_COST' as const,
            ruleType: 'REPLACE_WATTAGE' as const,
            fixedFraction: null,
            reduceHoursBy: null,
            targetWattLow: 9,
            targetWattHigh: 16,
            defaultSelected: true,
            orderIndex: 4,
        },
        {
            categoryCode: 'fridge',
            code: 'fridgeseal',
            titleLa: 'ຈັດລະບຽບຕູ້ເຢັນ ບໍ່ໃສ່ເຄື່ອງແໜ້ນເກີນໄປ ແລະ ກວດຂອບຢາງປະຕູ',
            titleEn: 'Avoid overpacking fridge and check door seals',
            descriptionLa: 'ຊ່ວຍໃຫ້ຄວາມເຢັນໝູນວຽນສະດວກ ຫຼຸດການເຮັດວຽກຂອງຄອມເພຣສເຊີລົງ 10%',
            descriptionEn: 'Better cold air circulation saves ~10% energy',
            effortLevel: 'EASY' as const,
            ruleType: 'FIXED_FRACTION' as const,
            fixedFraction: 0.10,
            reduceHoursBy: null,
            targetWattLow: null,
            targetWattHigh: null,
            defaultSelected: true,
            orderIndex: 5,
        },
        {
            categoryCode: 'heater',
            code: 'heatershower',
            titleLa: 'ປັບລະດັບຄວາມຮ້ອນພໍດີ ແລະ ປິດເຄື່ອງທຳນ້ຳອຸ່ນຂະນະຟອກສະບູ',
            titleEn: 'Lower heater setting and turn off while lathering',
            descriptionLa: 'ຫຼຸດພາລະກຳລັງໄຟສູງຂອງເຄື່ອງທຳນ້ຳອຸ່ນລົງໄດ້ປະມານ 20%',
            descriptionEn: 'Reduces high-wattage heating time by ~20%',
            effortLevel: 'EASY' as const,
            ruleType: 'FIXED_FRACTION' as const,
            fixedFraction: 0.20,
            reduceHoursBy: null,
            targetWattLow: null,
            targetWattHigh: null,
            defaultSelected: true,
            orderIndex: 6,
        },
        {
            categoryCode: 'standby',
            code: 'unplugstandby',
            titleLa: 'ຖອດປັກໄຟ ຫຼື ປິດສະວິດຮາງปลั๊กທຸກຄັ້ງຫຼັງໃຊ້ງານ',
            titleEn: 'Unplug appliances or switch off power strips when not in use',
            descriptionLa: 'ຕັດກະແສໄຟທີ່ສູນເສຍໄປລ້າໆ ຂະນະ Standby ໄດ້ເຖິງ 80%',
            descriptionEn: 'Eliminates up to 80% of phantom standby load',
            effortLevel: 'EASY' as const,
            ruleType: 'FIXED_FRACTION' as const,
            fixedFraction: 0.80,
            reduceHoursBy: null,
            targetWattLow: null,
            targetWattHigh: null,
            defaultSelected: true,
            orderIndex: 7,
        },
    ];

    for (const st of savingTemplatesData) {
        const categoryId = categoryMap[st.categoryCode];
        if (!categoryId) continue;

        await prisma.savingActionTemplate.upsert({
            where: { code: st.code },
            update: {
                categoryId,
                titleLa: st.titleLa,
                titleEn: st.titleEn,
                descriptionLa: st.descriptionLa,
                descriptionEn: st.descriptionEn,
                effortLevel: st.effortLevel,
                ruleType: st.ruleType,
                fixedFraction: st.fixedFraction,
                reduceHoursBy: st.reduceHoursBy,
                targetWattLow: st.targetWattLow,
                targetWattHigh: st.targetWattHigh,
                defaultSelected: st.defaultSelected,
                orderIndex: st.orderIndex,
                status: 'ACTIVE',
            },
            create: {
                categoryId,
                code: st.code,
                titleLa: st.titleLa,
                titleEn: st.titleEn,
                descriptionLa: st.descriptionLa,
                descriptionEn: st.descriptionEn,
                effortLevel: st.effortLevel,
                ruleType: st.ruleType,
                fixedFraction: st.fixedFraction,
                reduceHoursBy: st.reduceHoursBy,
                targetWattLow: st.targetWattLow,
                targetWattHigh: st.targetWattHigh,
                defaultSelected: st.defaultSelected,
                orderIndex: st.orderIndex,
                status: 'ACTIVE',
            },
        });
    }

    // 5.4 Tariff Notice & Monthly Schedules (May 2026 - Dec 2029)
    const notice = await prisma.tariffNotice.upsert({
        where: { noticeNumber: '1916/ຟຟລ.ຝທຜ' },
        update: {
            title: 'ແຈ້ງການ ໂຄງສ້າງອັດຕາຄ່າໄຟຟ້າປະເພດທີ່ຢູ່ອາໄສ (2026–2029)',
            issuedDate: new Date('2026-04-15'),
            effectiveFrom: new Date('2026-05-01'),
            effectiveTo: new Date('2029-12-31'),
            vatRate: 0.10,
            hotSeasonDiscountCapKwh: 300,
            status: 'ACTIVE',
        },
        create: {
            noticeNumber: '1916/ຟຟລ.ຝທຜ',
            title: 'ແຈ້ງການ ໂຄງສ້າງອັດຕາຄ່າໄຟຟ້າປະເພດທີ່ຢູ່ອາໄສ (2026–2029)',
            issuedDate: new Date('2026-04-15'),
            effectiveFrom: new Date('2026-05-01'),
            effectiveTo: new Date('2029-12-31'),
            vatRate: 0.10,
            hotSeasonDiscountCapKwh: 300,
            status: 'ACTIVE',
        },
    });

    // 8 ຂັ້ນບັນໄດມາດຕະຖານ ແລະ ອັດຕາຄ່າໄຟລາຍປີ (2026 - 2029)
    const yearlyRates: Record<number, number[]> = {
        2026: [355, 422, 999, 1200, 1450, 1750, 2050, 2350],
        2027: [450, 550, 1150, 1350, 1600, 1900, 2200, 2500],
        2028: [600, 720, 1300, 1500, 1750, 2050, 2350, 2650],
        2029: [750, 900, 1450, 1650, 1900, 2200, 2500, 2800],
    };

    const tierBrackets = [
        { tierOrder: 1, label: '0–25', minKwh: 0, maxKwh: 25 },
        { tierOrder: 2, label: '26–150', minKwh: 26, maxKwh: 150 },
        { tierOrder: 3, label: '151–300', minKwh: 151, maxKwh: 300 },
        { tierOrder: 4, label: '301–400', minKwh: 301, maxKwh: 400 },
        { tierOrder: 5, label: '401–500', minKwh: 401, maxKwh: 500 },
        { tierOrder: 6, label: '501–1,000', minKwh: 501, maxKwh: 1000 },
        { tierOrder: 7, label: '1,001–1,500', minKwh: 1001, maxKwh: 1500 },
        { tierOrder: 8, label: '> 1,500', minKwh: 1501, maxKwh: null },
    ];

    let scheduleCount = 0;
    for (let year = 2026; year <= 2029; year++) {
        const startMonth = year === 2026 ? 5 : 1;
        const rates = yearlyRates[year];

        for (let month = startMonth; month <= 12; month++) {
            const isHotSeason = month >= 3 && month <= 5; // ມີນາ - ພຶດສະພາ (ລະດູຮ້ອນ)

            const schedule = await prisma.tariffSchedule.upsert({
                where: {
                    year_month: { year, month },
                },
                update: {
                    noticeId: notice.id,
                    isHotSeason,
                },
                create: {
                    noticeId: notice.id,
                    year,
                    month,
                    isHotSeason,
                },
            });

            for (let i = 0; i < tierBrackets.length; i++) {
                const b = tierBrackets[i];
                const rateKipPerKwh = rates[i];

                await prisma.tariffTier.upsert({
                    where: {
                        scheduleId_tierOrder: {
                            scheduleId: schedule.id,
                            tierOrder: b.tierOrder,
                        },
                    },
                    update: {
                        label: b.label,
                        minKwh: b.minKwh,
                        maxKwh: b.maxKwh,
                        rateKipPerKwh,
                    },
                    create: {
                        scheduleId: schedule.id,
                        tierOrder: b.tierOrder,
                        label: b.label,
                        minKwh: b.minKwh,
                        maxKwh: b.maxKwh,
                        rateKipPerKwh,
                    },
                });
            }
            scheduleCount++;
        }
    }
    console.log(`==> [Prisma Seed] Seeded ${categoriesData.length} appliance categories, ${presetsData.length} presets, ${savingTemplatesData.length} saving templates, and ${scheduleCount} monthly tariff schedules (2026-2029).`);

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
