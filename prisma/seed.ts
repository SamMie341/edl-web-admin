import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');

    // เข้ารหัสรหัสผ่าน (ตัวอย่างตั้งรหัสผ่านเป็น: admin1234)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin1234', saltRounds);

    // ใช้ upsert เพื่อให้รันคำสั่งซ้ำได้โดยไม่เกิด Error ถ้ามีข้อมูลอยู่แล้ว
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@edl.com.la' }, // ใช้อีเมลอ้างอิง
        update: {}, // ถ้ามีอยู่แล้วไม่ต้องทำอะไร
        create: {
            employeeCode: 'EDL-0001',
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@edl.com.la',
            passwordHash: passwordHash,
            role: 'SUPERADMIN', // กำหนดสิทธิ์สูงสุด
            status: 'ACTIVE',
        },
    });

    console.log('Seeding finished.');
    console.log('Created Super Admin User:', superAdmin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });