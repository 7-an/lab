# Ansyn Lab · 网页预览

[打开在线预览](https://doublesq97-ui.github.io/ansyn-lab-preview/)

本仓库基于 [7-an/ansyn-lab-preview](https://github.com/7-an/ansyn-lab-preview)，保留原仓库历史，提供可直接运行的静态网页。它不包含完整 Astro 源工程，也不会修改或部署到 ansyn.me。

## GitHub Pages

发布来源为 `main` 分支、根目录 `/`。根目录的 `.nojekyll` 用于保留 `_astro` 等资源目录。本版本无需安装依赖或重新构建，推送到发布分支后即可更新 Pages。

站内资源使用 `/ansyn-lab-preview/` 路径。Fork 后若修改仓库名，或改用自定义域名，需同步调整资源路径、站内链接和网页元信息。Fork 本身不会替新仓库启用 Pages，需在该仓库的 Settings → Pages 中配置发布来源。

## 文件说明

- `index.html`、`work/`、`writing/`、`about/`：页面内容。
- `refinements/`：页面样式与交互，包括相册画框、粒子预览、标题反馈和滚动停靠。
- `ansyn-patch.css`、`ansyn-patch.js`：预览适配代码。
- `_astro/`：原预览的构建资源，其中部分交互已适配。
- `images/`、`media/`、`fonts/`：网站使用的素材与文件。

VOIDTYPE 交互基于 [7-an/voidtype](https://github.com/7-an/voidtype/)，相关许可见 `refinements/voidtype-notices.txt`。

## 后续维护

若已有原始开发工程，先保存当前工程，再将确认后的页面与交互迁回对应组件、样式和内容数据，避免下次构建覆盖修改。若只有这份静态网页，也可继续维护，但不能将它视为已还原的 Astro 工程。

已有同名原仓库时，可在备份后比较并合入本仓库的新增提交，不必重复 Fork。发布前应检查桌面与手机布局、语言切换、地球相册、项目和文章链接、联系入口及减弱动态模式。
