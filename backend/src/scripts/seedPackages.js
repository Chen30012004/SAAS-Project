require('dotenv').config();
const db = require('../config/db');

const seedPackages = async () => {
  const packages = [
    {
      name: "Student",
      description: "Gói tiết kiệm dành riêng cho học sinh, sinh viên",
      price: 20000,
      credits: 100,
      features: ["IMAGE_GENERATION"]
    },
    {
      name: "VIP",
      description: "Gói cao cấp với đầy đủ mọi tính năng AI mạnh mẽ nhất",
      price: 200000,
      credits: 2000,
      features: ["IMAGE_GENERATION", "AUTO_POST", "AI_AGENT"]
    }
  ];

  try {
    for (const pkg of packages) {
      // Dùng cú pháp chuẩn PostgreSQL để insert (nếu chưa có thì insert thêm, không thì thôi)
      // Nhưng để đơn giản ta cứ INSERT thẳng
      await db.query(
        `INSERT INTO packages (name, description, price, credits, features) 
         VALUES ($1, $2, $3, $4, $5)`,
        [pkg.name, pkg.description, pkg.price, pkg.credits, JSON.stringify(pkg.features)]
      );
      console.log(`✅ Đã thêm gói: ${pkg.name}`);
    }
  } catch (error) {
    console.error('❌ Error seeding packages:', error);
  } finally {
    process.exit(0);
  }
};

seedPackages();
