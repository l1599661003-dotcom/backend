/**
 * 同步数据库脚本
 * 使用 Sequelize 的 sync 方法创建或更新所有表
 */
import sequelize from '../config/database';

// 导入所有模型以确保它们被注册
import '../models';

async function syncDatabase() {
  try {
    console.log('开始同步数据库...');

    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 同步所有模型（不删除现有数据）
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库表同步成功');

    console.log('\n所有表已创建或更新：');
    const models = Object.keys(sequelize.models);
    models.forEach((model) => {
      console.log(`  - ${sequelize.models[model].tableName}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
    process.exit(1);
  }
}

syncDatabase();
