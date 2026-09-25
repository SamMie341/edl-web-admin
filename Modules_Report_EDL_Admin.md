# ບົດລາຍງານໂມດູນ ແລະ ສະຖາປັດຕະຍະກຳລະບົບ EDL Admin Backend
> **ລະບົບບໍລິຫານຈັດການຂໍ້ມູນ ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL Admin Management System)**  
> **ພາສາ/ເທັກໂນໂລຢີ:** NestJS (TypeScript), Prisma ORM, PostgreSQL  
> **ສະຖາປັດຕະຍະກຳ:** Clean Architecture / Domain-Driven Design (DDD)  
> **ສະຖານະ:** ພວມພັດທະນາ (Active Development)  
> **ອັບເດດຫຼ້າສຸດ:** 2026-09-14

---

## ສາລະບານ (Table of Contents)
1. [ພາບລວມສະຖາປັດຕະຍະກຳລະບົບ (System Architecture Overview)](#1-ພາບລວມສະຖາປັດຕະຍະກຳລະບົບ-system-architecture-overview)
2. [ຕາຕະລາງສັງລວມໂມດູນທັງໝົດ (Modules Summary Matrix)](#2-ຕາຕະລາງສັງລວມໂມດູນທັງໝົດ-modules-summary-matrix)
3. [ລາຍລະອຽດແຕ່ລະໂມດູນທີ່ພັດທະນາແລ້ວ (Active Modules)](#3-ລາຍລະອຽດແຕ່ລະໂມດູນທີ່ພັດທະນາແລ້ວ-active-modules)
   - [3.1 Auth Module (ລະບົບຢັ້ງຢືນຕົວຕົນ)](#31-auth-module-ລະບົບຢັ້ງຢືນຕົວຕົນ-authentication)
   - [3.2 Users Module (ລະບົບຈັດການຜູ້ໃຊ້ງານ & IAM)](#32-users-module-ລະບົບຈັດການຜູ້ໃຊ້ງານ--iam)
   - [3.3 Departments Module (ລະບົບຈັດການຂໍ້ມູນຝ່າຍ)](#33-departments-module-ລະບົບຈັດການຂໍ້ມູນຝ່າຍ)
   - [3.4 Branches Module (ລະບົບຈັດການຂໍ້ມູນສາຂາ)](#34-branches-module-ລະບົບຈັດການຂໍ້ມູນສາຂາ)
   - [3.5 Service Centers Module (ລະບົບຈັດການສູນບໍລິການລູກຄ້າ)](#35-service-centers-module-ລະບົບຈັດການສູນບໍລິການລູກຄ້າ)
   - [3.6 Provinces Module (ລະບົບຂໍ້ມູນແຂວງ)](#36-provinces-module-ລະບົບຂໍ້ມູນແຂວງ)
   - [3.7 Districts Module (ລະບົບຂໍ້ມູນເມືອງ)](#37-districts-module-ລະບົບຂໍ້ມູນເມືອງ)
   - [3.8 Villages Module (ລະບົບຂໍ້ມູນບ້ານ)](#38-villages-module-ລະບົບຂໍ້ມູນບ້ານ)
   - [3.9 Organization Structures Module (ລະບົບໂຄງຮ່າງການຈັດຕັ້ງ)](#39-organization-structures-module-ລະບົບໂຄງຮ່າງການຈັດຕັ້ງ)
   - [3.10 Vision & Missions Module (ລະບົບວິໄສທັດ ແລະ ພາລະກິດ)](#310-vision--missions-module-ລະບົບວິໄສທັດ-ແລະ-ພາລະກິດ)
   - [3.11 Electrical Knowledge Module (ລະບົບບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າ)](#311-electrical-knowledge-module-ລະບົບບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າ)
   - [3.12 Magazines Module (ລະບົບວາລະສານດິຈິຕອນ E-Magazine)](#312-magazines-module-ລະບົບວາລະສານດິຈິຕອນ-e-magazine)
   - [3.13 News Categories Module (ລະບົບໝວດໝູ່ຂ່າວສານ)](#313-news-categories-module-ລະບົບໝວດໝູ່ຂ່າວສານ)
   - [3.14 News Module (ລະບົບຂ່າວສານປະຊາສຳພັນ 2 ພາສາ)](#314-news-module-ລະບົບຂ່າວສານປະຊາສຳພັນ-2-ພາສາ)
   - [3.15 News Tags Module (ລະບົບແທັກຂ່າວສານ)](#315-news-tags-module-ລະບົບແທັກຂ່າວສານ)
4. [ແຜນພັດທະນາໂມດູນໃນອະນາຄົດ (Roadmap / Pending Modules)](#4-ແຜນພັດທະນາໂມດູນໃນອະນາຄົດ-roadmap--pending-modules)
5. [ຄູ່ມືການອັບເດດເອກະສານ (Documentation Update Guide)](#5-ຄູ່ມືການອັບເດດເອກະສານ-documentation-update-guide)

---

## 1. ພາບລວມສະຖາປັດຕະຍະກຳລະບົບ (System Architecture Overview)

ລະບົບ EDL Admin Backend ໄດ້ຖືກອອກແບບໂດຍອີງໃສ່ຫຼັກການ **Clean Architecture** ເພື່ອໃຫ້ແຕ່ລະສ່ວນແຍກອອກຈາກກັນຢ່າງເປັນອິດສະຫຼະ (Decoupled), ງ່າຍຕໍ່ການຮັກສາ (Maintainability), ແລະ ສະດວກໃນການທົດສອບ (Testability).

```
   ┌────────────────────────────────────────────────────────┐
   │               Presentation Layer (Controllers)         │
   │               - ຮັບ HTTP Request / ສົ່ງ HTTP Response   │
   │               - ກວດສອບຂໍ້ມູນຜ່ານ DTOs                   │
   │               - ປ້ອງກັນ API ດ້ວຍ JwtAuthGuard           │
   └───────────────────────────┬────────────────────────────┘
                               │ calls
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │               Application Layer (Use Cases)            │
   │               - ບັນຈຸ Business Logic ຫຼັກຂອງລະບົບ       │
   │               - ປະສານງານລະຫວ່າງ Repositories & Services│
   └───────────────────────────┬────────────────────────────┘
                               │ depends on
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │               Domain Layer (Core Logic & Interfaces)   │
   │               - Entities / Models                      │
   │               - Repository Interfaces                  │
   └───────────────────────────▲────────────────────────────┘
                               │ implements
   ┌───────────────────────────┴────────────────────────────┐
   │               Infrastructure Layer                     │
   │               - Prisma ORM / PostgreSQL Database       │
   │               - External Services (EDL HRM & Inside)   │
   │               - Local File System Storage (/uploads)   │
   └────────────────────────────────────────────────────────┘
```

---

## 2. ຕາຕະລາງສັງລວມໂມດູນທັງໝົດ (Modules Summary Matrix)

| ໂມດູນ (Module) | ເສັ້ນທາງ API (Base Path) | ຈຳນວນ Use Cases | ການເຊື່ອມຕໍ່ລະບົບພາຍນອກ | ສະຖານະ |
| :--- | :--- | :---: | :--- | :---: |
| **Auth** | `/api/v1/auth` | Service-based | ລະບົບ Hash ລະຫັດຜ່ານ (Bcrypt), JWT | ພ້ອມໃຊ້ງານ |
| **Users** | `/api/v1/users` | 5 | EDL HRM API (Sync ພະນັກງານ) | ພ້ອມໃຊ້ງານ |
| **Departments** | `/api/v1/departments` | 5 | - | ພ້ອມໃຊ້ງານ |
| **Branches** | `/api/v1/branches` | 6 | EDL Inside API (Sync ສາຂາ & ຮູບພາບ) | ພ້ອມໃຊ້ງານ |
| **Service Centers** | `/api/v1/service-centers` | 3 | EDL Inside API (Sync ສູນບໍລິການ) | ພ້ອມໃຊ້ງານ |
| **Provinces** | `/api/v1/provinces` | 2 | EDL HRM Address API | ພ້ອມໃຊ້ງານ |
| **Districts** | `/api/v1/districts` | 2 | EDL HRM District API | ພ້ອມໃຊ້ງານ |
| **Villages** | `/api/v1/villages` | 2 | EDL HRM Village API | ພ້ອມໃຊ້ງານ |
| **Organization Structures** | `/api/v1/org-structures` | 6 | File System (/uploads/org-structures) | ພ້ອມໃຊ້ງານ |
| **Vision & Missions** | `/api/v1/vision-missions` | 5 | File System (/uploads/vision-missions) | ພ້ອມໃຊ້ງານ |
| **Electrical Knowledge** | `/api/v1/electrical-knowledge` | 7 | File System (/uploads/electrical-knowledge) | ພ້ອມໃຊ້ງານ |
| **Magazines** | `/api/v1/magazines` | 7 | File System (/uploads/magazines) | ພ້ອມໃຊ້ງານ |
| **News Categories** | `/api/v1/news-categories` | 5 | - | ພ້ອມໃຊ້ງານ |
| **News** | `/api/v1/news` | 7 | File System (/uploads/news) | ພ້ອມໃຊ້ງານ |
| **News Tags** | `/api/v1/news-tags` | 5 | - | ພ້ອມໃຊ້ງານ |

---

## 3. ລາຍລະອຽດແຕ່ລະໂມດູນທີ່ພັດທະນາແລ້ວ (Active Modules)

---

### 3.1 Auth Module (ລະບົບຢັ້ງຢືນຕົວຕົນ - Authentication)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/auth/`
* **ຄວາມຮັບຜິດຊອບ:** 
  - ຢັ້ງຢືນຕົວຕົນຂອງພະນັກງານ ແລະ ຜູ້ບໍລິຫານ ເພື່ອເຂົ້າໃຊ້ງານລະບົບ.
  - ກວດສອບລະຫັດຜ່ານດ້ວຍ `bcrypt.compare` ກັບ Password Hash ໃນຖານຂໍ້ມູນ.
  - ກວດສອບສະຖານະບັນຊີ (`status === 'ACTIVE'`).
  - ສ້າງ ແລະ ລົງລາຍເຊັນ JWT Access Token ພ້ອມຂໍ້ມູນ Payload.
  - ບັນທຶກເວລາເຂົ້າສູ່ລະບົບຫຼ້າສຸດ (`lastLoginAt`).
  - ໃຫ້ບໍລິການ `JwtAuthGuard` ແລະ `JwtStrategy` ສຳລັບ Guard API ອື່ນໆ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/login` | No | ເຂົ້າສູ່ລະບົບ (Payload: `empCode`, `password`) |

#### ໂຄງສ້າງ DTO:
- `LoginDto`: ປະກອບມີ `empCode` (string) ແລະ `password` (string).

---

### 3.2 Users Module (ລະບົບຈັດການຜູ້ໃຊ້ງານ & IAM)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/users/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຈັດການຂໍ້ມູນບັນຊີຜູ້ໃຊ້ງານ ແລະ ສິດທິການເຂົ້າເຖິງລະບົບ (`SUPERADMIN`, `ADMIN`, `EDITOR`, `STAFF`).
  - ເຊື່ອມຕໍ່ກັບລະບົບ **HRM ຂອງ ຟຟລ** ເພື່ອດຶງຂໍ້ມູນພະນັກງານຕົວຈິງມາສ້າງບັນຊີໃໝ່ ຫຼື ອັບເດດຂໍ້ມູນສັງກັດ.

#### Use Cases ໃນລະບົບ:
1. **`SyncUserUseCase`**:
   - ດຶງຂໍ້ມູນພະນັກງານຜ່ານລະຫັດພະນັກງານ (`empCode`) ຈາກ HRM Service.
   - ຖ້າຍັງບໍ່ມີໃນລະບົບ: ສ້າງບັນຊີໃໝ່, ຕັ້ງລະຫັດຜ່ານເລີ່ມຕົ້ນເປັນ `edl<empCode>`, Hash ລະຫັດຜ່ານ, ແລະ ກຳນົດສິດເລີ່ມຕົ້ນເປັນ `ADMIN`.
   - ຖ້າມີແລ້ວ: ອັບເດດຂໍ້ມູນສັງກັດ (ຊື່, ນາມສະກຸນ, ຝ່າຍ, ພະແນກ, ໜ່ວຍງານ, ເບີໂທ).
2. **`GetUsersUseCase`**: ດຶງຂໍ້ມູນລາຍຊື່ຜູ້ໃຊ້ທັງໝົດໃນລະບົບ.
3. **`UpdateUserUseCase`**: ອັບເດດສິດທິ (Role) ແລະ ສະຖານະ (Status) ຂອງຜູ້ໃຊ້.
4. **`DeleteUserUseCase`**: ລຶບບັນຊີຜູ້ໃຊ້ອອກຈາກລະບົບ.
5. **`ChangePasswordUseCase`**: ປ່ຽນລະຫັດຜ່ານຜູ້ໃຊ້ງານ (ຮອງຮັບທັງການປ່ຽນດ້ວຍຕົນເອງໂດຍກວດສອບ `oldPassword` ຫຼື Admin Reset ລະຫັດຜ່ານໃໝ່).

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/users/sync/:empCode` | JWT | ຊິ້ງຂໍ້ມູນພະນັກງານຈາກລະບົບ HRM |
| `GET` | `/api/v1/users` | JWT | ດຶງລາຍຊື່ຜູ້ໃຊ້ງານທັງໝົດ |
| `PUT` | `/api/v1/users/change-role/:id` | JWT | ແກ້ໄຂສິດທິ/ສະຖານະຜູ້ໃຊ້ |
| `PUT` | `/api/v1/users/change-password/:id` | JWT | ປ່ຽນລະຫັດຜ່ານຜູ້ໃຊ້ງານ |
| `DELETE` | `/api/v1/users/:id` | JWT | ລຶບຜູ້ໃຊ້ອອກຈາກລະບົບ |

---

### 3.3 Departments Module (ລະບົບຈັດການຂໍ້ມູນຝ່າຍ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/departments/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງຂໍ້ມູນຝ່າຍຕ່າງໆ ພາຍໃນໂຄງສ້າງການຈັດຕັ້ງຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ.
  - ເປັນ Master Data ໃຫ້ກັບສາຂາ, ສູນບໍລິການ ແລະ ຜູ້ໃຊ້ງານ.

#### Use Cases ໃນລະບົບ:
1. **`CreateDepartmentUseCase`**: ເພີ່ມຂໍ້ມູນຝ່າຍໃໝ່.
2. **`GetDepartmentsUseCase`**: ດຶງລາຍຊື່ຝ່າຍທັງໝົດ ພ້ອມລຽງຕາມລຳດັບ.
3. **`GetDepartmentByIdUseCase`**: ດຶງຂໍ້ມູນຝ່າຍຕາມ ID.
4. **`UpdateDepartmentUseCase`**: ແກ້ໄຂຊື່ຝ່າຍ.
5. **`DeleteDepartmentUseCase`**: ລຶບຂໍ້ມູນຝ່າຍ (ມີ Business Logic ປ້ອງກັນບໍ່ໃຫ້ລຶບຖ້າຍັງມີສາຂາ ຫຼື ຜູ້ໃຊ້ສັງກັດຢູ່).

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/departments` | JWT | ເພີ່ມຝ່າຍໃໝ່ |
| `GET` | `/api/v1/departments` | JWT | ດຶງລາຍຊື່ຝ່າຍທັງໝົດ |
| `GET` | `/api/v1/departments/:id` | JWT | ດຶງຂໍ້ມູນຝ່າຍຕາມ ID |
| `PATCH` | `/api/v1/departments/:id` | JWT | ແກ້ໄຂຂໍ້ມູນຝ່າຍ |
| `DELETE` | `/api/v1/departments/:id` | JWT | ລຶບຂໍ້ມູນຝ່າຍ |

---

### 3.4 Branches Module (ລະບົບຈັດການຂໍ້ມູນສາຂາ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/branches/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງສາຂາຂອງ ຟຟລ ປະຈຳແຂວງ/ເຂດທົ່ວປະເທດ.
  - ເກັບກຳຂໍ້ມູນ: ຊື່ສາຂາ, ທີ່ຢູ່, ພິກັດແຜນທີ່, ອີເມວ, ເບີໂທ, ພາລະບົດບາດ, ແລະ ຮູບພາບຕ່າງໆ.
  - ເຊື່ອມຕໍ່ກັບ **Legacy Inside API** (`https://edl-inside-api.edl.com.la/branches/`) ເພື່ອດຶງຂໍ້ມູນ ແລະ ດາວໂຫຼດຮູບພາບສາຂາ, ຮູບໜ້າປົກ, ແລະ ແຜນຜັງໂຄງຮ່າງມາເກັບໃນເຄື່ອງ Server (`/uploads`).

#### Use Cases ໃນລະບົບ:
1. **`SyncBranchesUseCase`**: ດຶງຂໍ້ມູນຈາກ Legacy API, ດາວໂຫຼດຮູບພາບອັດຕະໂນມັດ ແລະ Upsert ລົງຖານຂໍ້ມູນ.
2. **`GetBranchesUseCase`**: ດຶງລາຍຊື່ສາຂາທັງໝົດ.
3. **`GetBranchByIdUseCase`**: ດຶງລາຍລະອຽດສາຂາຕາມ ID ພ້ອມຂໍ້ມູນຝ່າຍສັງກັດ.
4. **`CreateBranchUseCase`**: ສ້າງຂໍ້ມູນສາຂາໃໝ່.
5. **`UpdateBranchUseCase`**: ແກ້ໄຂຂໍ້ມູນສາຂາ ແລະ ສະຖານະ (`ACTIVE`, `INACTIVE`, `UNDER_MAINTENANCE`).
6. **`DeleteBranchUseCase`**: ລຶບສາຂາອອກຈາກລະບົບ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/branches/sync` | JWT | ຊິ້ງຂໍ້ມູນສາຂາ ແລະ ດາວໂຫຼດຮູບພາບ |
| `GET` | `/api/v1/branches` | JWT | ດຶງລາຍຊື່ສາຂາທັງໝົດ |
| `POST` | `/api/v1/branches` | JWT | ສ້າງສາຂາໃໝ່ |
| `GET` | `/api/v1/branches/:id` | JWT | ດຶງຂໍ້ມູນສາຂາຕາມ ID |
| `PUT` | `/api/v1/branches/:id` | JWT | ແກ້ໄຂຂໍ້ມູນສາຂາ |
| `DELETE` | `/api/v1/branches/:id` | JWT | ລຶບຂໍ້ມູນສາຂາ |

---

### 3.5 Service Centers Module (ລະບົບຈັດການສູນບໍລິການລູກຄ້າ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/service-centers/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງຂໍ້ມູນສູນບໍລິການລູກຄ້າໄຟຟ້າຂັ້ນເມືອງ/ບ້ານ.
  - ເກັບພິກັດ GPS (Latitude, Longitude) ສຳລັບສະແດງຜົນເທິງແຜນທີ່, ເບີໂທຕິດຕໍ່, ແລະ ຮູບພາບ.
  - ເຊື່ອມຕໍ່ກັບ **Inside API** (`https://edl-inside-api.edl.com.la/centers/`) ພ້ອມລະບົບ Mapping ທີ່ຕັ້ງ (ແຂວງ, ເມືອງ, ບ້ານ) ແລະ ສາຂາຕົ້ນສັງກັດ.

#### Use Cases ໃນລະບົບ:
1. **`SyncServiceCenterUseCase`**:
   - ດຶງຂໍ້ມູນສູນບໍລິການຈາກ Inside API.
   - Mapping ຂໍ້ມູນພູມສາດ (ແຂວງ-ເມືອງ-ບ້ານ) ແລະ ຈັບຄູ່ກັບສາຂາອັດຕະໂນມັດ (ມີເງື່ອນໄຂພິເສດແຍກ ນະຄອນຫຼວງ 1 ແລະ ນະຄອນຫຼວງ 2 ຕາມລາຍຊື່ເມືອງ).
   - ດາວໂຫຼດຮູບພາບ ແລະ ບັນທຶກລົງຖານຂໍ້ມູນ.
2. **`GetServiceUseCase`**: ດຶງລາຍຊື່ສູນບໍລິການທັງໝົດ ພ້ອມຂໍ້ມູນ Relation ສາຂາ ແລະ ທີ່ຕັ້ງ.
3. **`GetServiceByIdUseCase`**: ດຶງຂໍ້ມູນສູນບໍລິການຕາມ ID.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/service-centers/sync` | JWT | ຊິ້ງຂໍ້ມູນສູນບໍລິການ ແລະ ດາວໂຫຼດຮູບພາບ |
| `GET` | `/api/v1/service-centers` | JWT | ດຶງລາຍຊື່ສູນບໍລິການທັງໝົດ |
| `GET` | `/api/v1/service-centers/:id` | JWT | ດຶງຂໍ້ມູນສູນບໍລິການຕາມ ID |

---

### 3.6 Provinces Module (ລະບົບຂໍ້ມູນແຂວງ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/provinces/`
* **ຄວາມຮັບຜິດຊອບ:** ຄຸ້ມຄອງຂໍ້ມູນແຂວງທົ່ວປະເທດລາວ (18 ແຂວງ), ລະຫັດແຂວງ, ຕົວຫຍໍ້, ແລະ ລະຫັດສາຂາ.

#### Use Cases ໃນລະບົບ:
1. **`SyncProvinceUseCase`**: ຊິ້ງຂໍ້ມູນແຂວງຈາກລະບົບ **HRM Address Service API**.
2. **`GetProvincesUseCase`**: ດຶງລາຍຊື່ແຂວງທັງໝົດ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/provinces/sync` | JWT | ຊິ້ງຂໍ້ມູນແຂວງຈາກ HRM |
| `GET` | `/api/v1/provinces` | JWT | ດຶງລາຍຊື່ແຂວງທັງໝົດ (ສາມາດສົ່ງ `?includeDistricts=true` ເພື່ອດຶງລາຍຊື່ເມືອງພ້ອມ) |

---

### 3.7 Districts Module (ລະບົບຂໍ້ມູນເມືອງ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/districts/`
* **ຄວາມຮັບຜິດຊອບ:** ຄຸ້ມຄອງຂໍ້ມູນເມືອງທັງໝົດໃນ ສປປ ລາວ ພ້ອມຜູກໂຍງກັບລະຫັດແຂວງ (`provinceId`).

#### Use Cases ໃນລະບົບ:
1. **`SyncDistrictsUseCase`**: ຊິ້ງຂໍ້ມູນເມືອງຈາກລະບົບ **HRM District Service API** ພ້ອມກວດສອບ Relation ຫາແຂວງ.
2. **`GetDistrictsUseCase`**: ດຶງລາຍຊື່ເມືອງທັງໝົດ ຫຼື ກັ່ນຕອງຕາມແຂວງ (`provinceId`).

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/districts/sync` | JWT | ຊິ້ງຂໍ້ມູນເມືອງຈາກ HRM |
| `GET` | `/api/v1/districts` | JWT | ດຶງລາຍຊື່ເມືອງທັງໝົດ (ຮອງຮັບ `?provinceId=:id` ເພື່ອດຶງສະເພາະເມືອງໃນແຂວງນັ້ນ) |
| `GET` | `/api/v1/districts/province/:provinceId` | JWT | ດຶງສະເພາະເມືອງທີ່ຂຶ້ນກັບແຂວງຕາມ ID ທີ່ລະບຸ |

---

### 3.8 Villages Module (ລະບົບຂໍ້ມູນບ້ານ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/villages/`
* **ຄວາມຮັບຜິດຊອບ:** ຄຸ້ມຄອງຂໍ້ມູນບ້ານທັງໝົດໃນ ສປປ ລາວ ພ້ອມຜູກໂຍງກັບລະຫັດເມືອງ (`districtId`).

#### Use Cases ໃນລະບົບ:
1. **`SyncVillagesUseCase`**: ຊິ້ງຂໍ້ມູນບ້ານຈາກລະບົບ **HRM Village Service API** ພ້ອມກວດສອບ Relation ຫາເມືອງ.
2. **`GetVillagesUseCase`**: ດຶງລາຍຊື່ບ້ານທັງໝົດ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/villages/sync` | JWT | ຊິ້ງຂໍ້ມູນບ້ານຈາກ HRM |
| `GET` | `/api/v1/villages` | JWT | ດຶງລາຍຊື່ບ້ານທັງໝົດ |

---

### 3.9 Organization Structures Module (ລະບົບໂຄງຮ່າງການຈັດຕັ້ງ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/organization-structures/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງຂໍ້ມູນແຜນຜັງໂຄງຮ່າງການຈັດຕັ້ງ: ສະພາບໍລິຫານ (Board of Directors), ຄະນະບໍລິຫານ (Executive Board), ແລະ ແຜນຜັງໂຄງສ້າງອົງກອນ (Org Structure).
  - ຮອງຮັບການອັບໂຫຼດຮູບພາບແຜນຜັງໂຄງຮ່າງມາຍັງ Server (`/uploads/org-structures/`).
  - ໃຫ້ບໍລິການ Dropdown API ສຳລັບ Frontend ນຳໄປໃຊ້ສະແດງຜົນ.

#### Use Cases ໃນລະບົບ:
1. **`CreateOrgStructureUseCase`**: ສ້າງຂໍ້ມູນໂຄງຮ່າງໃໝ່.
2. **`GetOrgStructureUseCase`**: ດຶງລາຍການໂຄງຮ່າງທັງໝົດ.
3. **`GetOrgStructureDropdownUseCase`**: ດຶງສະເພາະ ID, ຊື່ ແລະ ປະເພດໂຄງຮ່າງສຳລັບ Dropdown.
4. **`UpdateOrgStructureUseCase`**: ແກ້ໄຂຂໍ້ມູນໂຄງຮ່າງ.
5. **`DeleteOrgStructureUseCase`**: ລຶບຂໍ້ມູນໂຄງຮ່າງ.
6. **`UploadImageStructureUseCase`**: ອັບໂຫຼດຮູບພາບໂຄງຮ່າງ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/org-structures` | JWT | ດຶງຂໍ້ມູນໂຄງຮ່າງການຈັດຕັ້ງທັງໝົດ |
| `GET` | `/api/v1/org-structures/dropdown` | JWT | ດຶງລາຍການໂຄງຮ່າງສຳລັບ Dropdown |
| `POST` | `/api/v1/org-structures` | JWT | ສ້າງໂຄງຮ່າງໃໝ່ (`structureType`: BOARD_OF_DIRECTORS, EXECUTIVE_BOARD, ORG_STRUCTURE) |
| `PUT` | `/api/v1/org-structures/:id` | JWT | ແກ້ໄຂຂໍ້ມູນໂຄງຮ່າງ |
| `DELETE` | `/api/v1/org-structures/:id` | JWT | ລຶບຂໍ້ມູນໂຄງຮ່າງ |
| `POST` | `/api/v1/org-structures/:id/upload/image` | JWT | ອັບໂຫຼດຮູບພາບໂຄງຮ່າງ (form-data: `file`) |

---

### 3.10 Vision & Missions Module (ລະບົບວິໄສທັດ ແລະ ພາລະກິດ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/vision-missions/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງຂໍ້ມູນວິໄສທັດ (Vision), ພາລະກິດ (Mission), ຄ່ານິຍົມຫຼັກ (Core Values), ແລະ ສະໂລແກນ (Slogan) ຂອງ ຟຟລ.
  - ຮອງຮັບການອັບໂຫຼດຮູບພາບປະກອບມາຍັງ Server (`/uploads/vision-missions/`).

#### Use Cases ໃນລະບົບ:
1. **`CreateVisionMissionUseCase`**: ສ້າງຂໍ້ມູນວິໄສທັດ/ພາລະກິດໃໝ່.
2. **`GetVisionMissionUseCase`**: ດຶງລາຍການວິໄສທັດ/ພາລະກິດທັງໝົດ.
3. **`UpdateVisionMissionUseCase`**: ແກ້ໄຂຂໍ້ມູນ.
4. **`DeleteVisionMissionUseCase`**: ລຶບຂໍ້ມູນ.
5. **`UploadVisionMissionImageUseCase`**: ອັບໂຫຼດຮູບພາບປະກອບ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/vision-missions` | JWT | ດຶງຂໍ້ມູນວິໄສທັດ ແລະ ພາລະກິດທັງໝົດ |
| `POST` | `/api/v1/vision-missions` | JWT | ສ້າງຂໍ້ມູນໃໝ່ (`entryType`: VISION, MISSION, CORE_VALUES, SLOGAN) |
| `PUT` | `/api/v1/vision-missions/:id` | JWT | ແກ້ໄຂຂໍ້ມູນ |
| `DELETE` | `/api/v1/vision-missions/:id` | JWT | ລຶບຂໍ້ມູນ |
| `POST` | `/api/v1/vision-missions/:id/upload/image` | JWT | ອັບໂຫຼດຮູບພາບປະກອບ (form-data: `file`) |

---

### 3.11 Electrical Knowledge Module (ລະບົບບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/electrical-knowledge/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງບົດຄວາມ ແລະ ຄລິບວິດິໂອໃຫ້ຄວາມຮູ້ດ້ານໄຟຟ້າ ແລະ ຄວາມປອດໄພ.
  - ຮອງຮັບເນື້ອຫາແບບ HTML Rich Text, ລິ້ງວິດິໂອ (YouTube/Video URL), ແລະ ການນັບຍອດເຂົ້າຊົມ (view_count).
  - ຮອງຮັບການອັບໂຫຼດຮູບໜ້າປົກ (Cover Image) ມາຍັງ Server (`/uploads/electrical-knowledge/`).

#### Use Cases ໃນລະບົບ:
1. **`CreateElectricalKnowledgeUseCase`**: ສ້າງບົດຄວາມໃໝ່.
2. **`GetElectricalKnowledgeUseCase`**: ດຶງລາຍຊື່ບົດຄວາມທັງໝົດ.
3. **`GetElectricalKnowledgeByIdUseCase`**: ດຶງລາຍລະອຽດບົດຄວາມຕາມ ID.
4. **`UpdateElectricalKnowledgeUseCase`**: ແກ້ໄຂບົດຄວາມ.
5. **`DeleteElectricalKnowledgeUseCase`**: ລຶບບົດຄວາມ.
6. **`UploadElectricalKnowledgeUseCase`**: ອັບໂຫຼດຮູບໜ້າປົກບົດຄວາມ.
7. **`IncrementElectricalKnowledgeViewUseCase`**: ເພີ່ມຍອດເຂົ້າຊົມບົດຄວາມ (`view_count`).

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/electrical-knowledge` | JWT | ດຶງລາຍຊື່ບົດຄວາມທັງໝົດ |
| `GET` | `/api/v1/electrical-knowledge/:id` | JWT | ດຶງຂໍ້ມູນບົດຄວາມຕາມ ID |
| `POST` | `/api/v1/electrical-knowledge` | JWT | ສ້າງບົດຄວາມໃໝ່ (`status`: ACTIVE, DRAFT, ARCHIVED) |
| `PATCH` | `/api/v1/electrical-knowledge/:id` | JWT | ແກ້ໄຂຂໍ້ມູນບົດຄວາມ |
| `DELETE` | `/api/v1/electrical-knowledge/:id` | JWT | ລຶບບົດຄວາມ |
| `PUT` | `/api/v1/electrical-knowledge/:id` | JWT | ເພີ່ມຍອດເຂົ້າຊົມບົດຄວາມ (Increment view count) |
| `POST` | `/api/v1/electrical-knowledge/:id/upload/cover` | JWT | ອັບໂຫຼດຮູບໜ້າປົກບົດຄວາມ (form-data: `file`) |

---

### 3.12 Magazines Module (ລະບົບວາລະສານດິຈິຕອນ E-Magazine)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/magazines/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງວາລະສານດິຈິຕອນ (E-Magazine) ຂອງ ຟຟລ.
  - ຮອງຮັບການອັບໂຫຼດຮູບໜ້າປົກ (`/uploads/magazines/covers/`) ແລະ ໄຟລ໌ເອກະສານ PDF (`/uploads/magazines/documents/`).
  - ບັນທຶກ ແລະ ນັບຍອດດາວໂຫຼດວາລະສານ (`download_count`).

#### Use Cases ໃນລະບົບ:
1. **`CreateMagazineUseCase`**: ສ້າງຂໍ້ມູນວາລະສານໃໝ່.
2. **`GetMagazinesUseCase`**: ດຶງລາຍຊື່ວາລະສານທັງໝົດ.
3. **`GetMagazineByIdUseCase`**: ດຶງລາຍລະອຽດວາລະສານຕາມ ID.
4. **`UpdateMagazineUseCase`**: ແກ້ໄຂຂໍ້ມູນວາລະສານ.
5. **`DeleteMagazinUseCase`**: ລຶບວາລະສານ.
6. **`IncrementMagazineDownloadUseCase`**: ເພີ່ມຍອດດາວໂຫຼດວາລະສານ.
7. **`UploadMagazineFilesUseCase`**: ອັບໂຫຼດຮູບໜ້າປົກ ຫຼື ໄຟລ໌ PDF.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/magazines` | JWT | ດຶງລາຍຊື່ວາລະສານທັງໝົດ |
| `GET` | `/api/v1/magazines/:id` | JWT | ດຶງຂໍ້ມູນວາລະສານຕາມ ID |
| `POST` | `/api/v1/magazines` | JWT | ສ້າງວາລະສານໃໝ່ |
| `PUT` | `/api/v1/magazines/:id` | JWT | ແກ້ໄຂຂໍ້ມູນວາລະສານ |
| `DELETE` | `/api/v1/magazines/:id` | JWT | ລຶບວາລະສານ |
| `PUT` | `/api/v1/magazines/:id/download` | JWT | ເພີ່ມຍອດດາວໂຫຼດ (Increment download count) |
| `POST` | `/api/v1/magazines/:id/upload/cover` | JWT | ອັບໂຫຼດຮູບໜ້າປົກວາລະສານ (form-data: `file`) |
| `POST` | `/api/v1/magazines/:id/upload/document` | JWT | ອັບໂຫຼດໄຟລ໌ເອກະສານ PDF (form-data: `file`) |

---

### 3.13 News Categories Module (ລະບົບໝວດໝູ່ຂ່າວສານ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/news-categories/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງໝວດໝູ່ຂ່າວສານປະຊາສຳພັນ ແລະ ບົດຄວາມຕ່າງໆ.
  - ຮອງຮັບການຈັດລຳດັບການສະແດງຜົນ (`order_index`) ແລະ ສະຖານະ (`ACTIVE`, `INACTIVE`).

#### Use Cases ໃນລະບົບ:
1. **`CreateNewsCategoryUseCase`**: ສ້າງໝວດໝູ່ຂ່າວໃໝ່.
2. **`GetNewsCategoriesUseCase`**: ດຶງລາຍຊື່ໝວດໝູ່ຂ່າວທັງໝົດ.
3. **`GetNewsCategoryByIdUseCase`**: ດຶງຂໍ້ມູນໝວດໝູ່ຕາມ ID.
4. **`UpdateNewsCategoryUseCase`**: ແກ້ໄຂຂໍ້ມູນໝວດໝູ່.
5. **`DeleteNewsCategoryUseCase`**: ລຶບໝວດໝູ່ຂ່າວ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/news-categories` | JWT | ດຶງລາຍຊື່ໝວດໝູ່ຂ່າວທັງໝົດ |
| `GET` | `/api/v1/news-categories/:id` | JWT | ດຶງຂໍ້ມູນໝວດໝູ່ຕາມ ID |
| `POST` | `/api/v1/news-categories` | JWT | ສ້າງໝວດໝູ່ຂ່າວໃໝ່ |
| `PATCH` | `/api/v1/news-categories/:id` | JWT | ແກ້ໄຂຂໍ້ມູນໝວດໝູ່ |
| `DELETE` | `/api/v1/news-categories/:id` | JWT | ລຶບໝວດໝູ່ຂ່າວ |

---

### 3.14 News Module (ລະບົບຂ່າວສານປະຊາສຳພັນ 2 ພາສາ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/news/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງຂ່າວສານປະຊາສຳພັນ 2 ພາສາ (ພາສາລາວ ແລະ ພາສາອັງກິດ) ພ້ອມຫົວຂໍ້ຂ່າວ, ຫົວຂໍ້ຍ່ອຍ, ແລະ ເນື້ອໃນ HTML.
  - ຮອງຮັບການອັບໂຫຼດຮູບໜ້າປົກ (`/uploads/news/covers/`) ແລະ ຮູບພາບ Gallery ຫຼາຍຮູບ (`/uploads/news/galleries/`).
  - ຮອງຮັບວິດິໂອລິ້ງ (YouTube/Video URL) ແລະ ນັບຍອດເຂົ້າຊົມຂ່າວ (`view_count`).
  - ຜູກໂຍງກັບໝວດໝູ່ຂ່າວສານ (`categoryId`).

#### Use Cases ໃນລະບົບ:
1. **`CreateNewsUseCase`**: ສ້າງຂ່າວສານໃໝ່.
2. **`GetNewsUseCase`**: ດຶງລາຍການຂ່າວສານທັງໝົດ.
3. **`GetNewsByIdUseCase`**: ດຶງລາຍລະອຽດຂ່າວສານຕາມ ID.
4. **`UpdateNewsUseCase`**: ແກ້ໄຂຂໍ້ມູນຂ່າວສານ.
5. **`DeleteNewsUseCase`**: ລຶບຂ່າວສານ.
6. **`IncrementNewsViewUseCase`**: ເພີ່ມຍອດເຂົ້າຊົມຂ່າວ.
7. **`UploadNewsImagesUseCase`**: ອັບໂຫຼດຮູບໜ້າປົກ (Cover) ຫຼື ຮູບພາບ Gallery (ສູງສຸດ 10 ຮູບ).

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/news` | JWT | ດຶງລາຍການຂ່າວສານທັງໝົດ |
| `GET` | `/api/v1/news/:id` | JWT | ດຶງຂໍ້ມູນຂ່າວຕາມ ID |
| `POST` | `/api/v1/news` | JWT | ສ້າງຂ່າວສານໃໝ່ (`status`: DRAFT, PUBLISHED, ARCHIVED) |
| `PATCH` | `/api/v1/news/:id` | JWT | ແກ້ໄຂຂໍ້ມູນຂ່າວສານ |
| `DELETE` | `/api/v1/news/:id` | JWT | ລຶບຂ່າວສານ |
| `PATCH` | `/api/v1/news/:id/view` | JWT | ເພີ່ມຍອດເຂົ້າຊົມຂ່າວ (Increment view count) |
| `POST` | `/api/v1/news/:id/upload/cover` | JWT | ອັບໂຫຼດຮູບໜ້າປົກຂ່າວ (form-data: `file`) |
| `POST` | `/api/v1/news/:id/upload/gallery` | JWT | ອັບໂຫຼດຮູບ Gallery ຫຼາຍຮູບ (form-data: `files`) |

---

### 3.15 News Tags Module (ລະບົບແທັກຂ່າວສານ)
* **ທີ່ຕັ້ງໂຟນເດີ:** `src/modules/news-tags/`
* **ຄວາມຮັບຜິດຊອບ:**
  - ຄຸ້ມຄອງແທັກຂ່າວສານ (News Tags) ສຳລັບຈັດກຸ່ມ ແລະ ຄົ້ນຫາຂ່າວສານ.

#### Use Cases ໃນລະບົບ:
1. **`CreateNewsTagUseCase`**: ສ້າງແທັກໃໝ່.
2. **`GetAllNewsTagUseCase`**: ດຶງລາຍຊື່ແທັກທັງໝົດ.
3. **`GetNewsTagByIdUseCase`**: ດຶງຂໍ້ມູນແທັກຕາມ ID.
4. **`UpdateNewsTagUseCase`**: ແກ້ໄຂຂໍ້ມູນແທັກ.
5. **`DeleteNewsTagUseCase`**: ລຶບແທັກ.

#### ເສັ້ນທາງ API (Endpoints):
| Method | URL | Auth Guard | ຄຳອະທິບາຍ |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/news-tags` | JWT | ດຶງລາຍຊື່ແທັກທັງໝົດ |
| `GET` | `/api/v1/news-tags/:id` | JWT | ດຶງຂໍ້ມູນແທັກຕາມ ID |
| `POST` | `/api/v1/news-tags` | JWT | ສ້າງແທັກໃໝ່ |
| `PUT` | `/api/v1/news-tags/:id` | JWT | ແກ້ໄຂຂໍ້ມູນແທັກ |
| `DELETE` | `/api/v1/news-tags/:id` | JWT | ລຶບແທັກອອກຈາກລະບົບ |

---

## 4. ແຜນພັດທະນາໂມດູນໃນອະນາຄົດ (Roadmap / Pending Modules)

ຕາມການອອກແບບໃນ **Prisma Schema (`schema.prisma`)** ແລະ **Data Dictionary**, ຍັງມີຕາຕະລາງທີ່ກຽມໄວ້ສຳລັບພັດທະນາເປັນ Module ໃໝ່ໃນຂັ້ນຕອນຕໍ່ໄປດັ່ງນີ້:

### 1. ໂມດູນຂໍ້ມູນສາທາລະນະ ແລະ ບໍລິການ (Public Disclosure & Services - MOD-03)
- **`electricity_tariffs`**: ປະກາດໂຄງສ້າງອັດຕາຄ່າໄຟຟ້າ (ທີ່ຢູ່ອາໄສ, ທຸລະກິດ, ອຸດສາຫະກຳ).
- **`legislations`**: ເອກະສານນິຕິກຳ, ດຳລັດ, ຂໍ້ຕົກລົງ, ແລະ ລະບຽບການ (ໄຟລ໌ PDF).
- **`procurements`**: ປະກາດປະມູນຈັດຊື້-ຈັດຈ້າງ, ເອກະສານ TOR, ວັນທີເປີດ-ປິດຊອງປະມູນ.
- **`job_postings`**: ປະກາດຮັບສະໝັກພະນັກງານໃໝ່ ພ້ອມກຳນົດວັນທີຮັບສະໝັກ.

### 2. ໂມດູນຕຳແໜ່ງງານ (Positions Management - MOD-04 Part 2)
- **`positions`**: ຕາຕະລາງ Master Data ຕຳແໜ່ງພະນັກງານ ສຳລັບຜູກໂຍງກັບປະກາດຮັບສະໝັກງານ ແລະ ໂຄງສ້າງບຸກຄະລາກອນ.

---

## 5. ຄູ່ມືການອັບເດດເອກະສານ (Documentation Update Guide)

ເພື່ອຮັກສາໃຫ້ເອກະສານສະບັບນີ້ທັນສະໄໝຢູ່ສະເໝີເມື່ອມີການພັດທະນາເພີ່ມເຕີມ, ໃຫ້ປະຕິບັດຕາມຂັ້ນຕອນດັ່ງນີ້:

1. **ເມື່ອມີການເພີ່ມ Endpoint ຫຼື Use Case ໃໝ່ໃນ Module ເດີມ:**
   - ເຂົ້າໄປທີ່ຫົວຂໍ້ຂອງ Module ນັ້ນໆ (ເຊັ່ນ 3.4 Branches Module).
   - ເພີ່ມຊື່ Use Case ພ້ອມອະທິບາຍ Logic ຫຍໍ້.
   - ເພີ່ມແຖວໃໝ່ໃນຕາຕະລາງ Endpoints (ລະບຸ Method, URL, Auth Guard, ຄຳອະທິບາຍ).
2. **ເມື່ອມີການສ້າງ Module ໃໝ່ (ເຊັ່ນ News Module):**
   - ເພີ່ມລາຍຊື່ Module ເຂົ້າໃນ **ຕາຕະລາງສັງລວມ (Section 2)**.
   - ສ້າງຫົວຂໍ້ໃໝ່ໃນ **Section 3** ຕາມແບບແຜນມາດຕະຖານ:
     - ທີ່ຕັ້ງໂຟນເດີ (Folder Path)
     - ຄວາມຮັບຜິດຊອບ (Responsibilities)
     - Use Cases
     - ເສັ້ນທາງ API (Endpoints)
   - ຕັດລາຍຊື່ Module ທີ່ສ້າງແລ້ວອອກຈາກ **Roadmap (Section 4)**.
3. **ເມື່ອມີການປ່ຽນແປງ Schema ຖານຂໍ້ມູນ:**
   - ກວດສອບ ແລະ ອັບເດດໃຫ້ສອດຄ່ອງກັບ `prisma/schema.prisma` ແລະ `Data_Dictionary_EDL_Admin.md`.
