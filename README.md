# 脑子清空器 - 部署说明

## 部署到 Vercel（推荐，最简单）

### 步骤：

1. **访问 Vercel官网**
   打开浏览器访问：https://vercel.com

2. **注册/登录账号**
   - 点击 "Sign Up" 注册（可以用 GitHub 账号直接登录）
   - 选择 GitHub 登录最方便

3. **导入项目**
   - 登录后点击 "New Project"（新建项目）
   - 选择 "Import Git Repository"（导入Git仓库）
   - 如果没有GitHub账号，可以直接拖拽文件夹上传

4. **部署**
   - 导入后点击 "Deploy"（部署）
   - 等待1-2分钟，Vercel会自动构建
   - 完成后会给你一个网址，如：`https://brain-clearer-xxx.vercel.app`

5. **手机访问**
   - 在手机浏览器打开那个网址
   - 点击浏览器分享按钮，选择"添加到主屏幕"
   - 以后就像App一样从桌面打开了

---

## 部署到 Netlify（备选）

1. 访问 https://app.netlify.com
2. 注册账号
3. 选择 "Add new site" → "Deploy manually"
4. 拖拽整个 `brain_clearer_web` 文件夹上传
5. 等待部署完成，得到网址

---

## 文件夹结构

```
brain_clearer_web/
├── index.html      # 主页面
├── style.css       # 样式
├── app.js          # 核心逻辑
└── vercel.json     # Vercel配置文件（自动部署用）
```

部署成功后，你的App网址就永久有效了，手机随时都能用！
