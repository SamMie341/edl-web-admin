const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    _postman_id: "e4d1a001-ed1a-4d1a-8000-000000000001",
    name: "EDL Admin Management System API",
    description: "Postman Collection ສຳລັບທົດສອບລະບົບ EDL Admin Backend API (NestJS Clean Architecture)\n\n### ຄຸນສົມບັດຫຼັກ:\n- ຮອງຮັບທຸກ Module: Auth, Users, Departments, Branches, Service Centers, Provinces, Districts, Villages, Organization Structures, Vision & Missions, Electrical Knowledge, Magazines, News Categories (ລວມ 62 Endpoints)\n- ລະບົບ Auto JWT: ເມື່ອ Login ສຳເລັດ ລະບົບຈະບັນທຶກ `accessToken` ລົງ Collection Variables ອັດຕະໂນມັດ ເພື່ອໃຊ້ກັບ Endpoint ອື່ນໆໄດ້ທັນທີ\n- URL Prefix: `http://localhost:3000/api/v1` (ປັບປ່ຽນໄດ້ຜ່ານຕົວປ່ຽນ `baseUrl`)",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{accessToken}}",
        type: "string"
      }
    ]
  },
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:3000/api/v1",
      type: "string",
      description: "Base URL ຂອງລະບົບ EDL Admin Backend"
    },
    {
      key: "accessToken",
      value: "",
      type: "string",
      description: "JWT Access Token (ຈະຖືກ set ອັດຕະໂນມັດເມື່ອ Login ສຳເລັດ)"
    }
  ],
  item: [
    // 1. Auth Module
    {
      name: "1. Authentication",
      description: "ໂມດູນຢັ້ງຢືນຕົວຕົນ ແລະ ການເຂົ້າສູ່ລະບົບ",
      item: [
        {
          name: "Login (ເຂົ້າສູ່ລະບົບ)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "// Auto-save accessToken to collection variables",
                  "if (pm.response.code === 200) {",
                  "    var res = pm.response.json();",
                  "    var token = (res.data && res.data.accessToken) || res.accessToken;",
                  "    if (token) {",
                  "        pm.collectionVariables.set('accessToken', token);",
                  "        console.log('✅ Access Token saved to collection variable successfully!');",
                  "    }",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            auth: {
              type: "noauth"
            },
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                empCode: "00001",
                password: "password123"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/auth/login",
              host: ["{{baseUrl}}"],
              path: ["auth", "login"]
            },
            description: "ເຂົ້າສູ່ລະບົບດ້ວຍລະຫັດພະນັກງານ (empCode) ແລະ ລະຫັດຜ່ານ (password)\n*ໝາຍເຫດ: ເມື່ອ Login ສຳເລັດ Postman ຈະບັນທຶກ JWT Token ເຂົ້າ Collection Variable ໂດຍອັດຕະໂນມັດ*"
          },
          response: []
        }
      ]
    },

    // 2. Users Module
    {
      name: "2. Users",
      description: "ໂມດູນຈັດການຜູ້ໃຊ້ງານ ແລະ ຊິງຄ໌ຂໍ້ມູນພະນັກງານຈາກ EDL HRM",
      item: [
        {
          name: "Get All Users (ດຶງລາຍຊື່ຜູ້ໃຊ້ທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/users",
              host: ["{{baseUrl}}"],
              path: ["users"]
            },
            description: "ດຶງລາຍຊື່ຜູ້ໃຊ້ງານລະບົບທັງໝົດ"
          },
          response: []
        },
        {
          name: "Sync User from HRM (ຊິງຄ໌ຂໍ້ມູນພະນັກງານຈາກ HRM)",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/users/sync/:empCode",
              host: ["{{baseUrl}}"],
              path: ["users", "sync", ":empCode"],
              variable: [
                {
                  key: "empCode",
                  value: "00001",
                  description: "ລະຫັດພະນັກງານທີ່ຕ້ອງການຊິງຄ໌ຂໍ້ມູນຈາກ EDL HRM"
                }
              ]
            },
            description: "ດຶງຂໍ້ມູນພະນັກງານຈາກລະບົບ EDL HRM ມາບັນທຶກ ຫຼື ອັບເດດໃນຖານຂໍ້ມູນ"
          },
          response: []
        },
        {
          name: "Change Role & Status (ແກ້ໄຂສິດ ແລະ ສະຖານະຜູ້ໃຊ້)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                role: "ADMIN",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/users/change-role/:id",
              host: ["{{baseUrl}}"],
              path: ["users", "change-role", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຜູ້ໃຊ້ງານ"
                }
              ]
            },
            description: "ແກ້ໄຂ Role (SUPERADMIN, ADMIN, EDITOR, STAFF) ແລະ Status (ACTIVE, INACTIVE, SUSPENDED)"
          },
          response: []
        },
        {
          name: "Change Password (ປ່ຽນລະຫັດຜ່ານ)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                oldPassword: "oldPassword123",
                newPassword: "newPassword123",
                confirmPassword: "newPassword123"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/users/change-password/:id",
              host: ["{{baseUrl}}"],
              path: ["users", "change-password", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຜູ້ໃຊ້ງານທີ່ຕ້ອງການປ່ຽນລະຫັດຜ່ານ"
                }
              ]
            },
            description: "ປ່ຽນລະຫັດຜ່ານຜູ້ໃຊ້ງານ (ຮອງຮັບທັງແບບ Admin Reset ໂດຍສົ່ງສະເພາະ newPassword ຫຼື ແບບກວດສອບ oldPassword)"
          },
          response: []
        },
        {
          name: "Delete User (ລຶບຜູ້ໃຊ້ງານ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/users/:id",
              host: ["{{baseUrl}}"],
              path: ["users", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຜູ້ໃຊ້ງານທີ່ຕ້ອງການລຶບ"
                }
              ]
            },
            description: "ລຶບຜູ້ໃຊ້ງານອອກຈາກລະບົບ"
          },
          response: []
        }
      ]
    },

    // 3. Departments Module
    {
      name: "3. Departments",
      description: "ໂມດູນຈັດການຂໍ້ມູນຝ່າຍ",
      item: [
        {
          name: "Get All Departments (ດຶງລາຍຊື່ຝ່າຍທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/departments",
              host: ["{{baseUrl}}"],
              path: ["departments"]
            },
            description: "ດຶງຂໍ້ມູນຝ່າຍທັງໝົດໃນລະບົບ"
          },
          response: []
        },
        {
          name: "Get Department By ID (ດຶງຂໍ້ມູນຝ່າຍຕາມ ID)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/departments/:id",
              host: ["{{baseUrl}}"],
              path: ["departments", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຝ່າຍ"
                }
              ]
            },
            description: "ດຶງລາຍລະອຽດຂໍ້ມູນຝ່າຍຕາມ ID"
          },
          response: []
        },
        {
          name: "Create Department (ເພີ່ມຝ່າຍໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "ຝ່າຍເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/departments",
              host: ["{{baseUrl}}"],
              path: ["departments"]
            },
            description: "ສ້າງຂໍ້ມູນຝ່າຍໃໝ່"
          },
          response: []
        },
        {
          name: "Update Department (ແກ້ໄຂຂໍ້ມູນຝ່າຍ)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "ຝ່າຍເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ ແລະ ການສື່ສານ"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/departments/:id",
              host: ["{{baseUrl}}"],
              path: ["departments", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຝ່າຍ"
                }
              ]
            },
            description: "ແກ້ໄຂຊື່ຝ່າຍ"
          },
          response: []
        },
        {
          name: "Delete Department (ລຶບຝ່າຍ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/departments/:id",
              host: ["{{baseUrl}}"],
              path: ["departments", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຝ່າຍທີ່ຕ້ອງການລຶບ"
                }
              ]
            },
            description: "ລຶບຂໍ້ມູນຝ່າຍອອກຈາກລະບົບ"
          },
          response: []
        }
      ]
    },

    // 4. Branches Module
    {
      name: "4. Branches",
      description: "ໂມດູນຈັດການຂໍ້ມູນສາຂາ ແລະ ຮູບພາບ",
      item: [
        {
          name: "Get All Branches (ດຶງລາຍຊື່ສາຂາທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/branches",
              host: ["{{baseUrl}}"],
              path: ["branches"]
            },
            description: "ດຶງລາຍຊື່ສາຂາທັງໝົດ"
          },
          response: []
        },
        {
          name: "Get Branch By ID (ດຶງຂໍ້ມູນສາຂາຕາມ ID)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/branches/:id",
              host: ["{{baseUrl}}"],
              path: ["branches", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສາຂາ"
                }
              ]
            },
            description: "ດຶງຂໍ້ມູນສາຂາຕາມ ID ພ້ອມຂໍ້ມູນ Relation ຝ່າຍ"
          },
          response: []
        },
        {
          name: "Create Branch (ສ້າງສາຂາໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                departmentId: 1,
                branchName: "ສາຂາ ນະຄອນຫຼວງ 1",
                address: "ບ້ານ ໂພນສີນວນ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ",
                email: "branch1@edl.com.la",
                phoneNumber: "021-412345",
                roleResponsibilities: "<p>ຄຸ້ມຄອງ ແລະ ບໍລິຫານລະບົບໄຟຟ້າເຂດນະຄອນຫຼວງ</p>",
                status: "ACTIVE",
                orderIndex: 1
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/branches",
              host: ["{{baseUrl}}"],
              path: ["branches"]
            },
            description: "ສ້າງສາຂາໃໝ່"
          },
          response: []
        },
        {
          name: "Update Branch (ແກ້ໄຂຂໍ້ມູນສາຂາ)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                departmentId: 1,
                branchName: "ສາຂາ ນະຄອນຫຼວງ 1 (ປັບປຸງ)",
                address: "ບ້ານ ໂພນສີນວນ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ",
                email: "contact@edl.com.la",
                phoneNumber: "021-412346",
                roleResponsibilities: "<p>ພາລະບົດບາດສະບັບປັບປຸງ</p>",
                status: "ACTIVE",
                orderIndex: 1
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/branches/:id",
              host: ["{{baseUrl}}"],
              path: ["branches", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສາຂາ"
                }
              ]
            },
            description: "ແກ້ໄຂຂໍ້ມູນສາຂາ"
          },
          response: []
        },
        {
          name: "Delete Branch (ລຶບສາຂາ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/branches/:id",
              host: ["{{baseUrl}}"],
              path: ["branches", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສາຂາ"
                }
              ]
            },
            description: "ລຶບຂໍ້ມູນສາຂາອອກຈາກລະບົບ"
          },
          response: []
        },
        {
          name: "Sync Branches from Inside API (ຊິງຄ໌ສາຂາຈາກ Inside API)",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/branches/sync",
              host: ["{{baseUrl}}"],
              path: ["branches", "sync"]
            },
            description: "ຊິງຄ໌ຂໍ້ມູນສາຂາ ແລະ ດາວໂຫຼດຮູບພາບສາຂາ/ຮູບໜ້າປົກ/ໂຄງຮ່າງ ອັດຕະໂນມັດຈາກ EDL Inside API"
          },
          response: []
        },
        {
          name: "Upload Branch Image (ອັບໂຫຼດຮູບພາບສາຂາ)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/branches/:id/upload/:imageType",
              host: ["{{baseUrl}}"],
              path: ["branches", ":id", "upload", ":imageType"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສາຂາ"
                },
                {
                  key: "imageType",
                  value: "branchImage",
                  description: "ປະເພດຮູບ: branchImage (ຮູບສາຂາ), coverImage (ຮູບໜ້າປົກ), orgChartImage (ຮູບໂຄງຮ່າງ)"
                }
              ]
            },
            description: "ອັບໂຫຼດຮູບພາບໃຫ້ສາຂາ ໂດຍເລືອກປະເພດຮູບໃນ :imageType (branchImage, coverImage, orgChartImage)"
          },
          response: []
        }
      ]
    },

    // 5. Service Centers Module
    {
      name: "5. Service Centers",
      description: "ໂມດູນຈັດການຂໍ້ມູນສູນບໍລິການລູກຄ້າ",
      item: [
        {
          name: "Get All Service Centers (ດຶງລາຍຊື່ສູນບໍລິການທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/service-centers",
              host: ["{{baseUrl}}"],
              path: ["service-centers"]
            },
            description: "ດຶງລາຍຊື່ສູນບໍລິການລູກຄ້າທັງໝົດ ພ້ອມຂໍ້ມູນ Relation ສາຂາ ແລະ ທີ່ຕັ້ງ"
          },
          response: []
        },
        {
          name: "Get Service Center By ID (ດຶງຂໍ້ມູນສູນບໍລິການຕາມ ID)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/service-centers/:id",
              host: ["{{baseUrl}}"],
              path: ["service-centers", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສູນບໍລິການ"
                }
              ]
            },
            description: "ດຶງລາຍລະອຽດສູນບໍລິການຕາມ ID"
          },
          response: []
        },
        {
          name: "Create Service Center (ສ້າງສູນບໍລິການໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                centerName: "ສູນບໍລິການລູກຄ້າ ໜອງບອນ",
                departmentId: 1,
                branchId: 1,
                provinceId: 1,
                districtId: 1,
                villageId: 1,
                phoneNumber: "020-55555555",
                longitude: 102.6321,
                latitude: 17.9757,
                imageUrl: "/uploads/centers/sample.jpg",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/service-centers",
              host: ["{{baseUrl}}"],
              path: ["service-centers"]
            },
            description: "ສ້າງສູນບໍລິການລູກຄ້າໃໝ່"
          },
          response: []
        },
        {
          name: "Update Service Center (ແກ້ໄຂຂໍ້ມູນສູນບໍລິການ)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                centerName: "ສູນບໍລິການລູກຄ້າ ໜອງບອນ (ປັບປຸງ)",
                phoneNumber: "020-99999999",
                longitude: 102.6325,
                latitude: 17.9760,
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/service-centers/:id",
              host: ["{{baseUrl}}"],
              path: ["service-centers", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສູນບໍລິການ"
                }
              ]
            },
            description: "ແກ້ໄຂຂໍ້ມູນສູນບໍລິການລູກຄ້າ"
          },
          response: []
        },
        {
          name: "Delete Service Center (ລຶບສູນບໍລິການ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/service-centers/:id",
              host: ["{{baseUrl}}"],
              path: ["service-centers", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສູນບໍລິການທີ່ຕ້ອງການລຶບ"
                }
              ]
            },
            description: "ລຶບຂໍ້ມູນສູນບໍລິການອອກຈາກລະບົບ"
          },
          response: []
        },
        {
          name: "Sync Service Centers from Inside API (ຊິງຄ໌ສູນບໍລິການ)",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/service-centers/sync",
              host: ["{{baseUrl}}"],
              path: ["service-centers", "sync"]
            },
            description: "ຊິງຄ໌ຂໍ້ມູນສູນບໍລິການ ແລະ ດາວໂຫຼດຮູບພາບຈາກ EDL Inside API"
          },
          response: []
        },
        {
          name: "Upload Service Center Image (ອັບໂຫຼດຮູບສູນບໍລິການ)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/service-centers/:id/upload/image",
              host: ["{{baseUrl}}"],
              path: ["service-centers", ":id", "upload", "image"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງສູນບໍລິການ"
                }
              ]
            },
            description: "ອັບໂຫຼດຮູບພາບສຳລັບສູນບໍລິການລູກຄ້າ"
          },
          response: []
        }
      ]
    },

    // 6. Provinces Module
    {
      name: "6. Provinces",
      description: "ໂມດູນຂໍ້ມູນແຂວງທົ່ວປະເທດ",
      item: [
        {
          name: "Get All Provinces (ດຶງລາຍຊື່ແຂວງທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/provinces?includeDistricts=true",
              host: ["{{baseUrl}}"],
              path: ["provinces"],
              query: [
                {
                  key: "includeDistricts",
                  value: "true",
                  description: "ຖ້າໃສ່ true ຈະດຶງຂໍ້ມູນເມືອງໃນແຕ່ລະແຂວງມານຳ (optional)"
                }
              ]
            },
            description: "ດຶງລາຍຊື່ແຂວງທັງໝົດໃນລະບົບ (ຮອງຮັບ param includeDistricts=true)"
          },
          response: []
        },
        {
          name: "Sync Provinces from HRM (ຊິງຄ໌ຂໍ້ມູນແຂວງຈາກ HRM)",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/provinces/sync",
              host: ["{{baseUrl}}"],
              path: ["provinces", "sync"]
            },
            description: "ຊິງຄ໌ຂໍ້ມູນແຂວງຈາກ EDL HRM Address API"
          },
          response: []
        }
      ]
    },

    // 7. Districts Module
    {
      name: "7. Districts",
      description: "ໂມດູນຂໍ້ມູນເມືອງ",
      item: [
        {
          name: "Get All Districts (ດຶງລາຍຊື່ເມືອງທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/districts?provinceId=1",
              host: ["{{baseUrl}}"],
              path: ["districts"],
              query: [
                {
                  key: "provinceId",
                  value: "1",
                  description: "ກັ່ນຕອງຕາມ ID ແຂວງ (optional)"
                }
              ]
            },
            description: "ດຶງລາຍຊື່ເມືອງທັງໝົດ (ສາມາດ filter ດ້ວຍ ?provinceId=... ໄດ້)"
          },
          response: []
        },
        {
          name: "Get Districts By Province ID (ດຶງເມືອງຕາມ ID ແຂວງ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/districts/province/:provinceId",
              host: ["{{baseUrl}}"],
              path: ["districts", "province", ":provinceId"],
              variable: [
                {
                  key: "provinceId",
                  value: "1",
                  description: "ID ຂອງແຂວງ"
                }
              ]
            },
            description: "ດຶງລາຍຊື່ເມືອງທັງໝົດທີ່ຂຶ້ນກັບແຂວງທີ່ລະບຸ"
          },
          response: []
        },
        {
          name: "Sync Districts from HRM (ຊິງຄ໌ຂໍ້ມູນເມືອງຈາກ HRM)",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/districts/sync",
              host: ["{{baseUrl}}"],
              path: ["districts", "sync"]
            },
            description: "ຊິງຄ໌ຂໍ້ມູນເມືອງຈາກ EDL HRM District API"
          },
          response: []
        }
      ]
    },

    // 8. Villages Module
    {
      name: "8. Villages",
      description: "ໂມດູນຂໍ້ມູນບ້ານ",
      item: [
        {
          name: "Get All Villages (ດຶງລາຍຊື່ບ້ານທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/villages",
              host: ["{{baseUrl}}"],
              path: ["villages"]
            },
            description: "ດຶງລາຍຊື່ບ້ານທັງໝົດ"
          },
          response: []
        },
        {
          name: "Sync Villages from HRM (ຊິງຄ໌ຂໍ້ມູນບ້ານຈາກ HRM)",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/villages/sync",
              host: ["{{baseUrl}}"],
              path: ["villages", "sync"]
            },
            description: "ຊິງຄ໌ຂໍ້ມູນບ້ານຈາກ EDL HRM Village API"
          },
          response: []
        }
      ]
    },

    // 9. Organization Structures Module
    {
      name: "9. Organization Structures",
      description: "ໂມດູນຈັດການໂຄງຮ່າງການຈັດຕັ້ງ: ສະພາບໍລິຫານ, ຄະນະບໍລິຫານ, ແລະ ໂຄງສ້າງອົງກອນ",
      item: [
        {
          name: "Get All Org Structures (ດຶງໂຄງສ້າງອົງກອນທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/org-structures",
              host: ["{{baseUrl}}"],
              path: ["org-structures"]
            },
            description: "ດຶງຂໍ້ມູນໂຄງຮ່າງການຈັດຕັ້ງທັງໝົດ"
          },
          response: []
        },
        {
          name: "Get Org Structures Dropdown (ດຶງ Dropdown)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/org-structures/dropdown",
              host: ["{{baseUrl}}"],
              path: ["org-structures", "dropdown"]
            },
            description: "ດຶງລາຍການໂຄງຮ່າງສຳລັບສະແດງໃນ Dropdown ເມນູ"
          },
          response: []
        },
        {
          name: "Create Org Structure (ສ້າງໂຄງຮ່າງໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                structureType: "BOARD_OF_DIRECTORS",
                structureName: "ສະພາບໍລິຫານ ຟຟລ (Board of Directors)",
                imageUrl: "/uploads/org-structures/sample.jpg",
                orderIndex: 1,
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/org-structures",
              host: ["{{baseUrl}}"],
              path: ["org-structures"]
            },
            description: "ສ້າງໂຄງຮ່າງອົງກອນໃໝ່\n- structureType: BOARD_OF_DIRECTORS | EXECUTIVE_BOARD | ORG_STRUCTURE\n- status: ACTIVE | INACTIVE"
          },
          response: []
        },
        {
          name: "Update Org Structure (ແກ້ໄຂໂຄງຮ່າງ)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                structureType: "EXECUTIVE_BOARD",
                structureName: "ຄະນະບໍລິຫານ ຟຟລ (Executive Board)",
                imageUrl: "/uploads/org-structures/sample-updated.jpg",
                orderIndex: 2,
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/org-structures/:id",
              host: ["{{baseUrl}}"],
              path: ["org-structures", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງໂຄງຮ່າງ"
                }
              ]
            },
            description: "ແກ້ໄຂຂໍ້ມູນໂຄງຮ່າງອົງກອນ"
          },
          response: []
        },
        {
          name: "Delete Org Structure (ລຶບໂຄງຮ່າງ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/org-structures/:id",
              host: ["{{baseUrl}}"],
              path: ["org-structures", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງໂຄງຮ່າງທີ່ຕ້ອງການລຶບ"
                }
              ]
            },
            description: "ລຶບໂຄງຮ່າງອົງກອນອອກຈາກລະບົບ"
          },
          response: []
        },
        {
          name: "Upload Org Structure Image (ອັບໂຫຼດຮູບໂຄງຮ່າງ)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/org-structures/:id/upload/image",
              host: ["{{baseUrl}}"],
              path: ["org-structures", ":id", "upload", "image"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງໂຄງຮ່າງ"
                }
              ]
            },
            description: "ອັບໂຫຼດຮູບພາບໂຄງຮ່າງອົງກອນ"
          },
          response: []
        }
      ]
    },

    // 10. Vision & Missions Module
    {
      name: "10. Vision & Missions",
      description: "ໂມດູນຈັດການວິໄສທັດ, ພາລະກິດ, ຄ່ານິຍົມຫຼັກ ແລະ ສະໂລແກນ ຂອງ ຟຟລ",
      item: [
        {
          name: "Get All Vision & Missions (ດຶງຂໍ້ມູນທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/vision-missions",
              host: ["{{baseUrl}}"],
              path: ["vision-missions"]
            },
            description: "ດຶງຂໍ້ມູນວິໄສທັດ ແລະ ພາລະກິດທັງໝົດ"
          },
          response: []
        },
        {
          name: "Create Vision & Mission (ສ້າງຂໍ້ມູນໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                entryType: "VISION",
                title: "ວິໄສທັດຂອງ ຟຟລ (Vision)",
                slogan: "ພະລັງງານສີຂຽວ ເພື່ອການພັດທະນາແບບຍືນຍົງ",
                description: "ເປັນລັດວິສາຫະກິດຊັ້ນນຳໃນການສະໜອງພະລັງງານໄຟຟ້າທີ່ໝັ້ນຄົງ ແລະ ປອດໄພ...",
                imageUrl: "/uploads/vision-missions/sample.jpg",
                orderIndex: 1,
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/vision-missions",
              host: ["{{baseUrl}}"],
              path: ["vision-missions"]
            },
            description: "ສ້າງຂໍ້ມູນວິໄສທັດ/ພາລະກິດ\n- entryType: VISION | MISSION | CORE_VALUES | SLOGAN\n- status: ACTIVE | INACTIVE"
          },
          response: []
        },
        {
          name: "Update Vision & Mission (ແກ້ໄຂຂໍ້ມູນ)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                entryType: "MISSION",
                title: "ພາລະກິດ (Mission)",
                slogan: "ບໍລິການດ້ວຍຄວາມຈິງໃຈ",
                description: "ສະໜອງພະລັງງານໄຟຟ້າຢ່າງພຽງພໍ, ໝັ້ນຄົງ ແລະ ທົ່ວເຖິງ...",
                orderIndex: 2,
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/vision-missions/:id",
              host: ["{{baseUrl}}"],
              path: ["vision-missions", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຂໍ້ມູນ"
                }
              ]
            },
            description: "ແກ້ໄຂຂໍ້ມູນວິໄສທັດ ແລະ ພາລະກິດ"
          },
          response: []
        },
        {
          name: "Delete Vision & Mission (ລຶບຂໍ້ມູນ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/vision-missions/:id",
              host: ["{{baseUrl}}"],
              path: ["vision-missions", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຂໍ້ມູນທີ່ຕ້ອງການລຶບ"
                }
              ]
            },
            description: "ລຶບຂໍ້ມູນວິໄສທັດ/ພາລະກິດອອກຈາກລະບົບ"
          },
          response: []
        },
        {
          name: "Upload Vision & Mission Image (ອັບໂຫຼດຮູບ)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/vision-missions/:id/upload/image",
              host: ["{{baseUrl}}"],
              path: ["vision-missions", ":id", "upload", "image"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງຂໍ້ມູນ"
                }
              ]
            },
            description: "ອັບໂຫຼດຮູບພາບສຳລັບວິໄສທັດ/ພາລະກິດ"
          },
          response: []
        }
      ]
    },

    // 11. Electrical Knowledge Module
    {
      name: "11. Electrical Knowledge",
      description: "ໂມດູນບົດຄວາມ ແລະ ວິດິໂອຄວາມຮູ້ດ້ານໄຟຟ້າ ແລະ ຄວາມປອດໄພ",
      item: [
        {
          name: "Get All Electrical Knowledge (ດຶງບົດຄວາມທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/electrical-knowledge",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge"]
            },
            description: "ດຶງລາຍຊື່ບົດຄວາມ ແລະ ວິດິໂອຄວາມຮູ້ດ້ານໄຟຟ້າທັງໝົດ"
          },
          response: []
        },
        {
          name: "Get Electrical Knowledge By ID (ດຶງບົດຄວາມຕາມ ID)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/electrical-knowledge/:id",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງບົດຄວາມ"
                }
              ]
            },
            description: "ດຶງລາຍລະອຽດບົດຄວາມຕາມ ID"
          },
          response: []
        },
        {
          name: "Create Electrical Knowledge (ສ້າງບົດຄວາມໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "ວິທີການນຳໃຊ້ໄຟຟ້າຢ່າງປອດໄພໃນລະດູຝົນ",
                coverImage: "/uploads/electrical-knowledge/sample.jpg",
                videoUrl: "https://www.youtube.com/watch?v=sample",
                content: "<p>ເນື້ອໃນບົດຄວາມແນະນຳການນຳໃຊ້ໄຟຟ້າຢ່າງຖືກຕ້ອງ ແລະ ປອດໄພໃນຍາມຝົນ...</p>",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/electrical-knowledge",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge"]
            },
            description: "ສ້າງບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າໃໝ່ (ຮອງຮັບ HTML content ຈາກ Rich Text Editor)\n- status: ACTIVE | DRAFT | ARCHIVED"
          },
          response: []
        },
        {
          name: "Update Electrical Knowledge (ແກ້ໄຂບົດຄວາມ)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "ວິທີການນຳໃຊ້ໄຟຟ້າຢ່າງປອດໄພໃນລະດູຝົນ (ສະບັບປັບປຸງ)",
                content: "<p>ເນື້ອໃນບົດຄວາມສະບັບປັບປຸງ...</p>",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/electrical-knowledge/:id",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງບົດຄວາມ"
                }
              ]
            },
            description: "ແກ້ໄຂບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າ"
          },
          response: []
        },
        {
          name: "Delete Electrical Knowledge (ລຶບບົດຄວາມ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/electrical-knowledge/:id",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງບົດຄວາມທີ່ຕ້ອງການລຶບ"
                }
              ]
            },
            description: "ລຶບຂໍ້ມູນບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າ"
          },
          response: []
        },
        {
          name: "Upload Electrical Knowledge Cover (ອັບໂຫຼດຮູບປົກ)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/electrical-knowledge/:id/upload/cover",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge", ":id", "upload", "cover"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງບົດຄວາມ"
                }
              ]
            },
            description: "ອັບໂຫຼດຮູບໜ້າປົກສຳລັບບົດຄວາມຄວາມຮູ້ດ້ານໄຟຟ້າ"
          },
          response: []
        },
        {
          name: "Increment View Count (ເພີ່ມຍອດເຂົ້າຊົມ)",
          request: {
            method: "PUT",
            header: [],
            url: {
              raw: "{{baseUrl}}/electrical-knowledge/:id",
              host: ["{{baseUrl}}"],
              path: ["electrical-knowledge", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງບົດຄວາມ"
                }
              ]
            },
            description: "ເພີ່ມຍອດເຂົ້າຊົມ (viewCount) ຂອງບົດຄວາມ"
          },
          response: []
        }
      ]
    },

    // 12. Magazines Module
    {
      name: "12. Magazines",
      description: "ໂມດູນຈັດການວາລະສານດິຈິຕອນ (E-Magazine) ພ້ອມອັບໂຫຼດໄຟລ໌ PDF ແລະ ຮູບໜ້າປົກ",
      item: [
        {
          name: "Get All Magazines (ດຶງລາຍຊື່ວາລະສານທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/magazines",
              host: ["{{baseUrl}}"],
              path: ["magazines"]
            },
            description: "ດຶງລາຍຊື່ວາລະສານທັງໝົດໃນລະບົບ"
          },
          response: []
        },
        {
          name: "Get Magazine By ID (ດຶງຂໍ້ມູນວາລະສານຕາມ ID)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/magazines/:id",
              host: ["{{baseUrl}}"],
              path: ["magazines", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງວາລະສານ"
                }
              ]
            },
            description: "ດຶງລາຍລະອຽດວາລະສານຕາມ ID"
          },
          response: []
        },
        {
          name: "Create Magazine (ສ້າງວາລະສານໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "ວາລະສານ ໄຟຟ້າລາວ ສະບັບທີ 45",
                issueNumber: "Vol. 45 - 2026",
                coverImage: "/uploads/magazines/covers/sample.jpg",
                fileUrl: "/uploads/magazines/documents/sample.pdf",
                publishedDate: "2026-09-01T00:00:00.000Z",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/magazines",
              host: ["{{baseUrl}}"],
              path: ["magazines"]
            },
            description: "ສ້າງຂໍ້ມູນວາລະສານໃໝ່\n- status: ACTIVE | INACTIVE"
          },
          response: []
        },
        {
          name: "Update Magazine (ແກ້ໄຂວາລະສານ)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "ວາລະສານ ໄຟຟ້າລາວ ສະບັບທີ 45 (ສະບັບປັບປຸງ)",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/magazines/:id",
              host: ["{{baseUrl}}"],
              path: ["magazines", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງວາລະສານ"
                }
              ]
            },
            description: "ແກ້ໄຂຂໍ້ມູນວາລະສານ"
          },
          response: []
        },
        {
          name: "Delete Magazine (ລຶບວາລະສານ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/magazines/:id",
              host: ["{{baseUrl}}"],
              path: ["magazines", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງວາລະສານ"
                }
              ]
            },
            description: "ລຶບວາລະສານອອກຈາກລະບົບ"
          },
          response: []
        },
        {
          name: "Increment Download Count (ເພີ່ມຍອດດາວໂຫຼດ)",
          request: {
            method: "PUT",
            header: [],
            url: {
              raw: "{{baseUrl}}/magazines/:id/download",
              host: ["{{baseUrl}}"],
              path: ["magazines", ":id", "download"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງວາລະສານ"
                }
              ]
            },
            description: "ເພີ່ມຍອດດາວໂຫຼດ (downloadCount) ຂອງວາລະສານ"
          },
          response: []
        },
        {
          name: "Upload Magazine Cover (ອັບໂຫຼດຮູບໜ້າປົກ)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ຮູບພາບ (JPG, PNG, WEBP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/magazines/:id/upload/cover",
              host: ["{{baseUrl}}"],
              path: ["magazines", ":id", "upload", "cover"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງວາລະສານ"
                }
              ]
            },
            description: "ອັບໂຫຼດຮູບໜ້າປົກວາລະສານ"
          },
          response: []
        },
        {
          name: "Upload Magazine Document (ອັບໂຫຼດໄຟລ໌ເອກະສານ PDF)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  description: "ເລືອກໄຟລ໌ເອກະສານ PDF"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/magazines/:id/upload/document",
              host: ["{{baseUrl}}"],
              path: ["magazines", ":id", "upload", "document"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງວາລະສານ"
                }
              ]
            },
            description: "ອັບໂຫຼດໄຟລ໌ PDF ຂອງວາລະສານ"
          },
          response: []
        }
      ]
    },

    // 13. News Categories Module
    {
      name: "13. News Categories",
      description: "ໂມດູນຈັດການໝວດໝູ່ຂ່າວສານປະຊາສຳພັນ",
      item: [
        {
          name: "Get All News Categories (ດຶງໝວດໝູ່ຂ່າວທັງໝົດ)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/news-categories",
              host: ["{{baseUrl}}"],
              path: ["news-categories"]
            },
            description: "ດຶງລາຍຊື່ໝວດໝູ່ຂ່າວທັງໝົດ"
          },
          response: []
        },
        {
          name: "Get News Category By ID (ດຶງໝວດໝູ່ຂ່າວຕາມ ID)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/news-categories/:id",
              host: ["{{baseUrl}}"],
              path: ["news-categories", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງໝວດໝູ່ຂ່າວ"
                }
              ]
            },
            description: "ດຶງລາຍລະອຽດໝວດໝູ່ຂ່າວຕາມ ID"
          },
          response: []
        },
        {
          name: "Create News Category (ສ້າງໝວດໝູ່ຂ່າວໃໝ່)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                categoryName: "ຂ່າວສານການເຄື່ອນໄຫວ",
                description: "ຂ່າວສານການເຄື່ອນໄຫວທົ່ວໄປຂອງ ຟຟລ",
                orderIndex: 1,
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/news-categories",
              host: ["{{baseUrl}}"],
              path: ["news-categories"]
            },
            description: "ສ້າງໝວດໝູ່ຂ່າວໃໝ່\n- status: ACTIVE | INACTIVE"
          },
          response: []
        },
        {
          name: "Update News Category (ແກ້ໄຂໝວດໝູ່ຂ່າວ)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                categoryName: "ຂ່າວສານການເຄື່ອນໄຫວ (ປັບປຸງ)",
                status: "ACTIVE"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/news-categories/:id",
              host: ["{{baseUrl}}"],
              path: ["news-categories", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງໝວດໝູ່ຂ່າວ"
                }
              ]
            },
            description: "ແກ້ໄຂໝວດໝູ່ຂ່າວ"
          },
          response: []
        },
        {
          name: "Delete News Category (ລຶບໝວດໝູ່ຂ່າວ)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/news-categories/:id",
              host: ["{{baseUrl}}"],
              path: ["news-categories", ":id"],
              variable: [
                {
                  key: "id",
                  value: "1",
                  description: "ID ຂອງໝວດໝູ່ຂ່າວ"
                }
              ]
            },
            description: "ລຶບໝວດໝູ່ຂ່າວອອກຈາກລະບົບ"
          },
          response: []
        }
      ]
    }
  ]
};

const jsonStr = JSON.stringify(collection, null, 2);

const rootPath = path.resolve(__dirname, '..', 'EDL_Admin_API.postman_collection.json');
fs.writeFileSync(rootPath, jsonStr, 'utf-8');
console.log('Successfully saved to root:', rootPath);

const innerPath = path.resolve(__dirname, 'EDL_Admin_API.postman_collection.json');
fs.writeFileSync(innerPath, jsonStr, 'utf-8');
console.log('Successfully saved to inner:', innerPath);
