# Ms V Lab 完整部署指南（小白版，手把手教）

> **预计耗时**：30-45 分钟  
> **核心原则**：每一步都有截图级文字描述，按顺序做，**不要跳步**

---

## 📋 部署前准备清单

- [ ] 电脑联网
- [ ] 浏览器打开：GitHub、Netlify、Cloudflare、Namecheap 四个标签页
- [ ] 记事本准备好，记下生成的各种密码/Token
- [ ] 确认本地文件夹 `Documents/go go go/Ms V Lab` 里有所有文件

---

## 第一阶段：推送代码到 GitHub（5 分钟）

### 1.1 注册/登录 GitHub
- 打开 https://github.com
- 没账号 → Sign up（邮箱、密码、用户名）
- 有账号 → Sign in

### 1.2 创建私有仓库
1. 点击右上角 `+` → **New repository**
2. **Repository name**：`msvlab-site` （必须全小写、连字符）
3. **Description**：`Ms V Lab 产品评测站 - Astro + Decap CMS`
4. ✅ **Private**（私有，防止内容被抄）
5. ❌ **不要**勾选 `Add a README file` / `Add .gitignore` / `Choose a license`
6. 点击 **Create repository**

### 1.3 本地推送代码（终端操作）
```bash
# 打开终端
cd "Documents/go go go/Ms V Lab"

# 初始化 git
git init

# 查看状态（确认有文件）
git status

# 全部加入
git add .

# 提交
git commit -m "Initial commit: Ms V Lab review site with Chinese CMS"

# 关联远程仓库（把 YOUR_USERNAME 换成你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/msvlab-site.git

# 推送
git push -u origin main
```

⚠️ **易错点**：
- `YOUR_USERNAME` 必须换成你的 GitHub 用户名（区分大小写）
- 如果提示 `fatal: remote origin already exists` → 先 `git remote remove origin` 再加
- 如果推送失败 `Permission denied` → 确认 GitHub 账号密码/Token 正确

### 1.4 验证
- 刷新 GitHub 仓库页面 → 应该看到所有文件（src、public、package.json 等）

---

## 第二阶段：Netlify 部署 + CMS 配置（10 分钟）

### 2.1 注册/登录 Netlify
- 打开 https://app.netlify.com
- 推荐：**Continue with GitHub** 一键授权登录

### 2.2 导入仓库
1. 点击 **Add new site** → **Import an existing project**
2. 选择 **GitHub** → 授权 Netlify 访问你的仓库
3. 搜索 `msvlab-site` → 点击选中
4. **Build settings** 检查：
   - **Base directory**：留空
   - **Build command**：`npm run build` （已在 netlify.toml 里，自动识别）
   - **Publish directory**：`dist` （已在 netlify.toml 里）
5. 点击 **Deploy site**

### 2.3 等待构建（~1-2 分钟）
- 看到 **Site deploy succeeded** → 成功
- 记下临时域名：`https://xxx.netlify.app` （后面要用）

### 2.4 绑定自定义域名
1. 点击站点名 → **Site settings** → **Domain management**
2. **Add custom domain** → 输入 `msvlab.site` → **Verify** → **Add domain**
3. 同理添加 `www.msvlab.site`
4. 等待 DNS 检查通过（显示绿色对勾）

### 2.5 开启 HTTPS（必须）
- **Domain management** → **HTTPS** → 确认 **Force HTTPS** 开启
- **HSTS** → **Enable** → **Save**

### 2.6 开启 CMS 认证（核心步骤！）
1. **Site settings** → **Identity** → **Enable Identity**
2. **Registration preferences** → **Invite only** （只允许邀请）
3. **Email templates** → 可自定义邀请邮件（可跳过）
3. **Services** → **Git Gateway** → **Enable Git Gateway**
   - 等待几秒显示 **Git Gateway enabled**

### 2.7 邀请自己进 CMS
1. **Identity** 标签页 → **Invite users**
2. 输入 **你的常用邮箱** → **Send**
3. 去邮箱收邮件 → 点击 **Accept the invite**
4. 设置密码 → 完成注册

### 2.8 验证 CMS
- 访问 `https://xxx.netlify.app/admin` （你的临时域名 + /admin）
- 应该看到 **中文登录页** → 输入邮箱密码 → 进入 **全中文后台**

⚠️ **易错点**：
- **必须**开启 Git Gateway，否则 CMS 保存不了内容
- **必须**设为 Invite only，否则任何人都能注册进后台
- 邀请邮件可能在垃圾箱，记得查一下
- 如果 `/admin` 进不去 → 检查 Identity 是否 Enable、Git Gateway 是否 Enable

---

## 第三阶段：Cloudflare DNS + 代理（10 分钟）

### 3.1 登录/注册 Cloudflare
- 打开 https://dash.cloudflare.com
- 没账号 → Sign Up（邮箱、密码）
- 有账号 → Log In

### 3.2 添加站点
1. 点击 **Add a site** → 输入 `msvlab.site` → **Continue**
2. 选择 **Free** 计划 → **Continue**
3. **DNS records** 页面 → 先不管，直接 **Continue**

### 3.3 修改 Namecheap NS（关键！）
1. 新标签页打开 https://www.namecheap.com → 登录
2. **Domain List** → 找到 `msvlab.site` → **Manage**
3. 左侧/顶部 **Nameservers** → 选择 **Custom DNS**
4. 填入 Cloudflare 给的 2 个 NS（类似）：
   - `alex.ns.cloudflare.com`
   - `bella.ns.cloudflare.com`
5. 点击 ✅ 绿色对勾保存
6. 等待 1-5 分钟生效（Cloudflare 会提示 "Great news!..."）

### 3.4 Cloudflare 添加 DNS 记录（指向 Netlify）
回到 Cloudflare **DNS** → **Records** → **Add record** 添加 5 条：

| Type | Name | IPv4 address / Target | Proxy status |
|------|------|----------------------|--------------|
| A | @ | 75.2.60.5 | 🟠 **Proxied** (橙云) |
| A | @ | 99.83.190.102 | 🟠 **Proxied** |
| A | @ | 35.165.127.189 | 🟠 **Proxied** |
| A | @ | 52.204.9.122 | 🟠 **Proxied** |
| CNAME | www | `xxx.netlify.app` (你的临时域名) | 🟠 **Proxied** |

⚠️ **易错点**：
- **必须**开启橙云代理（Proxied），否则没有 CDN/WAF 保护
- CNAME 的 Target 填 **你的 Netlify 临时域名**（不带 https://）
- Namecheap 改 NS 后要等几分钟，Cloudflare 才会显示 "Active"
- 如果 DNS 记录已存在 → 先删掉旧的再加新的

### 3.5 开启 Cloudflare 安全功能
- **SSL/TLS** → **Overview** → **Full (strict)**
- **SSL/TLS** → **Edge Certificates** → **Always Use HTTPS** → **On**
- **SSL/TLS** → **Edge Certificates** → **Automatic HTTPS Rewrites** → **On**
- **Speed** → **Optimization** → **Auto Minify** → 勾选 CSS/JS/HTML
- **Caching** → **Configuration** → **Browser Cache TTL** → **1 year**

---

## 第四阶段：Netlify 最终验证（5 分钟）

### 4.1 等待 DNS 生效
- Cloudflare 显示 "Active" → 回 Netlify **Domain management**
- 等 `msvlab.site` 和 `www.msvlab.site` 都显示绿色 **Netlify DNS** / **Verified**

### 4.2 最终测试
| 地址 | 预期结果 |
|------|----------|
| `https://msvlab.site` | 打开首页，有样式、有导航 |
| `https://www.msvlab.site` | 自动跳转到主域名 |
| `https://msvlab.site/admin` | 中文登录页 → 登录后进后台 |
| `https://msvlab.site/reviews/sony-wh-1000xm5/` | 评测页有图、有联盟按钮 |

### 4.3 CMS 实战测试
1. 进 `https://msvlab.site/admin`
2. 点 **评测文章** → **New 评测文章**
3. 随便填几个必填字段 → 保存
3. 等 ~10 秒 → 网站自动重新部署
4. 刷新前台 → 新文章出现

---

## 🎯 常见坑 & 解决方案

| 现象 | 原因 | 解决 |
|------|------|------|
| `git push` 失败 `Permission denied` | GitHub 认证失败 | 使用 Personal Access Token 代替密码 |
| Netlify 构建失败 `Command not found` | Node 版本不对 | netlify.toml 已指定 Node 18，检查是否生效 |
| `/admin` 进不去 / 404 | Identity/Git Gateway 未开 | Settings → Identity → Enable + Git Gateway Enable |
| CMS 保存后网站不更新 | Git Gateway 未授权 / 构建失败 | 查看 Netlify Deploy log 报错信息 |
| 域名打不开 / SSL 错误 | DNS 未生效 / SSL 模式不对 | 等 DNS 传播；Cloudflare SSL 选 Full (strict) |
| Cloudflare 显示 "Pending Nameserver" | Namecheap NS 未改 / 未生效 | 确认 Namecheap Custom DNS 填了 CF 的 2 个 NS |
| CMS 图片上传失败 | media_folder 配置不对 | config.yml 里 `media_folder: "src/assets/images"` |
| 邀请邮件收不到 | 进垃圾箱 / 延迟 | 查垃圾箱；或重新 Invite |

---

## 📞 部署后日常操作

| 操作 | 入口 |
|------|------|
| 写新评测 | `https://msvlab.site/admin` → 评测文章 → New |
| 发精选推荐 | `https://msvlab.site/admin` → 精选推荐 → New |
| 发优惠信息 | `https://msvlab.site/admin` → 优惠信息 → New |
| 上传图片 | 编辑器里直接拖拽 / 点击上传 |
| 改联盟链接 | 对应字段粘贴新链接 → 保存 |
| 查看部署状态 | Netlify 后台 → Deploys |

---

## ✅ 最终检查清单（部署完成前逐项核对）

- [ ] GitHub 仓库 `msvlab-site` 有所有文件
- [ ] Netlify 部署成功，有 `xxx.netlify.app` 临时域名
- [ ] Netlify Identity **Enable** + **Invite only** + **Git Gateway Enable**
- [ ] 自己邮箱收到邀请，设置密码，能进 `/admin` 中文后台
- [ ] Cloudflare 添加站点，Namecheap 改 NS 到 Cloudflare
- [ ] Cloudflare DNS 添加 4 个 A 记录 + 1 个 CNAME，**全开橙云代理**
- [ ] Cloudflare SSL 选 **Full (strict)**，Always Use HTTPS 开启
- [ ] Netlify 绑定 `msvlab.site` + `www.msvlab.site`，显示 Verified
- [ ] `https://msvlab.site` 打开正常，`/admin` 能登录进中文后台
- [ ] CMS 里新建一篇文章，保存后网站自动更新

---

## 📁 本地备份文件

- `msvlab-site-deploy.zip` (341 KB) — 解压即得完整源码
- 放在安全位置（网盘/移动硬盘），万一云端挂了能恢复

---

**祝部署顺利，联盟大卖！** 🚀  
有卡住的步骤随时截图发我，我帮你看哪里不对。

---

> **提示**：第一次部署难免卡壳，**耐心按步骤来**，每个坑我都踩过并写了解法。不用急，慢慢来。
