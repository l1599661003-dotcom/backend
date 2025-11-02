#!/bin/bash

# 部署脚本
# 使用方法：在服务器上运行 bash deploy.sh

echo "🚀 开始部署后端..."

# 进入项目目录
cd /home/apps/backend

# 拉取最新代码（如果使用 Git）
echo "📥 拉取最新代码..."
git pull origin main

# 安装依赖
echo "📦 安装依赖..."
npm install --production

# 编译 TypeScript
echo "🔨 编译 TypeScript..."
npm run build

# 重启服务
echo "🔄 重启服务..."
pm2 restart backend

# 查看状态
echo "✅ 部署完成！"
pm2 status

# 查看日志
echo "📋 最近日志："
pm2 logs backend --lines 50
